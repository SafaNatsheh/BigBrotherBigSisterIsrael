import React, { Component } from "react";
import Video from "../partial/video/Video";
import VidButtons from "../partial/video/VidButtons";
import Chat from "../partial/chat/Chat";
import "./VideoPage.css";
import firebase, {auth} from "../../../config/Firebase"
import Credit from "../partial/credit/Credit"

const configuration = { // determine internet configuation
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    }
  ],
  iceCandidatePoolSize: 10,
};

const constraints = {
  audio: true,
  video: {
    width: { ideal: 1920 },
    height: { ideal: 1080 }
  }
};

const localVideo = React.createRef();

const remoteVideo = React.createRef();

class VideoPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      localStream: null,
      remoteStream: null,
      localPeer: null,
      roomId: "",
      localChannel: null,
      remoteChannel: null,
      start_btn_disable: false,
      hang_btn_disable: true,
      create_btn_disable: false,
      join_btn_disable: false,
      send_btn_disable: true,
      input_disable: true,
      fullScreen: true,
      muteVis: "hidden",
      vidVis: "hidden",
      isStarted: false,
      isConnected: false,
      isFinished: false,
      readyToJoin: false,
      timer: [0, 0, 0, 0, 0],
      intervalFunc: null,
      timeoutChecking: null,
      timeoutDisconnected: null,
      outMes: { mes: "" },
      disconFlag: false,
      checkFlag: false,
      firstSnapShot: null,
      secondSnapShot: null,
      firstTimeDirect: true,
      mute_icon: "black",
      video_icon: "black",
      rem_mute_icon: "black",
      rem_video_icon: "black"
    }
    this.usersRef = firebase.firestore().collection('Users');
  }

  startVideoDirectly = () => { // auto video start
    this.startVideo();
    var checkIfStartedStream = setInterval(() => {
      if (this.state.localStream && this.state.remoteStream) {
        if (this.props.hostVid)
          this.createRoom();
        else
          this.joinRoomById(this.props.room_id);
        clearInterval(checkIfStartedStream)
      }
    }, 200);
  }

  componentDidMount() {
    auth.onAuthStateChanged(user=> {
      console.log(user)
      if (!user) {
        window.location.href = "/"
        return
      }
      if (this.props.directVid && (this.props.room_id !== "" || this.props.hostVid))
        this.startVideoDirectly();
    })
  }

  componentWillUnmount(event) {
    if (this.state.isStarted)
      this.hangUp(false, false);
  }

  componentDidUpdate(prevProp) {
    if (this.props.directVid !== prevProp.directVid)
      if (this.props.directVid)
        this.startVideoDirectly();
  }

  startVideo = async () => {
    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        console.log("Chrome has received your local stream successfully\nUsing video device: " +
          stream.getVideoTracks()[0].label + "\nUsing audio device: " + stream.getAudioTracks()[0].label);
        this.setState({ remoteStream: new MediaStream() }, () => {
          remoteVideo.current.srcObject = this.state.remoteStream;
        });
        this.setState({ localStream: stream }, async () => {
          localVideo.current.srcObject = this.state.localStream;
          this.setState({
            isStarted: true,
            hang_btn_disable: false, start_btn_disable: true
          });
          this.props.modifyVideoStream(); // modifing app about a new video stream
        });
      })
      .catch(e => {
        alert(e.name);
        this.props.modifyVideoNotAllowed();
      });
  }

  createRoom = async () => {
    if (!this.state.isStarted) {
      alert("אנא לחץ על כפתור 'התחל שיחת וידאו'")
      return;
    }

    this.setState({ create_btn_disable: true })

    this.setState({ localPeer: new RTCPeerConnection(configuration) }, async () => {   // create local peer
      console.log("Created local peer");
      this.getMediaTracks();
      this.getRemoteMediaTracks();
      this.handleDataChannel('first_channel');


      const offer = await this.state.localPeer.createOffer(); // creating offer request

      const roomOffer = {
        offer: {
          type: offer.type,
          sdp: offer.sdp
        }
      }

      const roomRef = await this.usersRef
        .doc(this.props.linkId)
        .collection('Rooms')
        .add(roomOffer);

      this.connectionHandler(roomRef, 'first_participant', 'second_participant'); // handle internet connection (based on ICE protocol)
      try {
        await this.state.localPeer.setLocalDescription(offer);
      }
      catch (e) {
        console.log(e.name);
      }
      var firstSnap = roomRef.onSnapshot(async snapshot => { // waiting for an answer
        const data = snapshot.data();
        try {
          if (!this.state.localPeer.currentRemoteDescription && typeof (data.answer) !== 'undefined') {
            console.log(`Got update room is ${snapshot.id}`)
            console.log(`Set remote description: ${data.answer}`);
            const answer = new RTCSessionDescription(data.answer);
            console.log(answer);
            await this.state.localPeer.setRemoteDescription(answer);
          }
        }
        catch (e) {
          console.log(e.name);
        }
      });
      this.setState({ firstSnapShot: firstSnap });
    });
  }

  joinRoom = (guestId) => { // For joining a room with entering friend's room ID as an input (optional) 
    if (!this.state.isStarted) {
      alert("אנא לחץ על כפתור 'התחל שיחה'")
      return;
    }
    if (guestId === "") {
      alert("אנא הכנס את מספר החדר של החניך/חונך");
      return;
    }
    this.joinRoomById(guestId);
  }

  joinRoomById = async (roomIdOfGuest) => {
    this.setState({
      create_btn_disable: true,
      join_btn_disable: true
    });
    console.log(`You want to join room ${roomIdOfGuest}`);
    if (roomIdOfGuest === "") {
      alert(this.props.linkedName + " ביטל את השיחה");
      document.location.reload(true);
      return;
    }

    const roomRef = this.usersRef
      .doc(this.props.myLinkId)
      .collection('Rooms')
      .doc(`${roomIdOfGuest}`);
    const roomSnap = await roomRef.get();
    console.log(`Room existance in DB: ${roomSnap.exists}`);

    if (!roomSnap.exists) {
      alert("החדר לא קיים במערכת. נסה שוב.");
      this.setState({
        create_btn_disable: false,
        join_btn_disable: false
      })
      return;
    }
    this.setState({ readyToJoin: true, roomId: "מספר החדר שלך הינו: " + roomRef.id });
    console.log(`Creating peer connection with the configuration: ${configuration}`);
    this.setState({ localPeer: new RTCPeerConnection(configuration) }, async () => {
      console.log("Created local peer");
      this.getMediaTracks();
      this.getRemoteMediaTracks();
      this.handleDataChannel('second_channel');

      this.connectionHandler(roomRef, 'second_participant', 'first_participant'); // handle internet connection (based on ICE protocol)

      const offer = roomSnap.data().offer;
      console.log("created offer");
      await this.state.localPeer.setRemoteDescription(offer);
      const answer = await this.state.localPeer.createAnswer();
      await this.state.localPeer.setLocalDescription(answer);
      const roomAnswer = {
        answer: {
          type: answer.type,
          sdp: answer.sdp
        }
      }
      await roomRef.update(roomAnswer);
    });
  }

  hangUp = (val, willReload = true) => {
    var isConfirmed;
    if (!val)
      isConfirmed = true;
    else
      isConfirmed = window.confirm("האם אתה בטוח שברצונך לסיים את השיחה?");
    if (isConfirmed) {
      this.setState({ isFinished: true });
      if (this.state.localChannel && this.state.localChannel.readyState === 'open' &&
        this.state.remoteChannel && (val || !willReload))
        this.state.localChannel.send(JSON.stringify({ finish: true }))
      if (this.state.firstSnapShot !== null)
        this.state.firstSnapShot();
      if (this.state.secondSnapShot !== null)
        this.state.secondSnapShot();
      clearInterval(this.state.intervalFunc);
      this.state.localStream.getTracks().forEach(track => track.stop());
      console.log("Closed local tracks")
      if (this.state.remoteStream) {
        this.state.remoteStream.getTracks().forEach(track => track.stop());
        console.log("Closed remote tracks")
      }
      if (val && willReload && this.state.isConnected)
        alert("סיימת את השיחה. זמן השיחה: " +
          this.state.timer[0] + ":" + this.state.timer[1] + "" +
          this.state.timer[2] + ":" + this.state.timer[3] + "" +
          this.state.timer[4]);
      else if (!val && willReload && this.state.isConnected)
        alert("זמן השיחה: " +
          this.state.timer[0] + ":" + this.state.timer[1] + "" +
          this.state.timer[2] + ":" + this.state.timer[3] + "" +
          this.state.timer[4]);
      if (this.state.localPeer !== null) {
        this.state.localPeer.close();
        console.log("Closed local peer")
      }
      this.setState({ localPeer: null });
      if (willReload) {
        setTimeout(() => {
          document.location.reload(true);
        }, 500);
      }
      else
        this.props.removeDocs();
    }
  }

  connectionHandler = async (roomRef, localName, remoteName) => { // handle internet connection
    const candidateCol = roomRef.collection(localName);
    try {
      this.state.localPeer.addEventListener('icecandidate', event => {
        if (event.candidate) {
          const jsonData = event.candidate.toJSON();
          candidateCol.add(jsonData);
        }
      });
    }
    catch (e) {
      console.log(e.name)
    }
    try {
      this.state.localPeer.onconnectionstatechange = this.onIceChanged;
    }
    catch (e) {
      console.log(e.name)
    }
    var secondSnap = roomRef.collection(remoteName).onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === "added" || change.doc.data()) {
          const candidate = new RTCIceCandidate(change.doc.data());
          this.state.localPeer.addIceCandidate(candidate);
          console.log(`candidate success`);
        }
      });
    });
    this.setState({ secondSnapShot: secondSnap });
  }

  onIceChanged = (e) => { // internet connection change event
    var currStat = e.target;
    console.log(`ICE connection state changed: ${currStat.iceConnectionState}`);
    if (currStat.iceConnectionState === "connected" && !this.state.isConnected) // first time connection
      this.onCandidateConnected();
    else if (currStat.iceConnectionState === "connected" && this.state.isConnected) // reconnection
      this.onReconnection();
    else if (currStat.iceConnectionState === "disconnected" && this.state.isConnected) // disconnecction after connection
      this.onCandidateDisconnected();
    else if ((currStat.iceConnectionState === "disconnected" || currStat.iceConnectionState === "checking")
      && !this.state.isConnected) // disconnection before connection
      this.onCandidateChecking();
  };

  mateDisconnected = () => {
    clearInterval(this.state.intervalFunc);
    alert(this.props.linkedName + " סיים את השיחה.");
    this.hangUp(false);
  }

  onCandidateConnected = () => {
    console.log("תהליך ההתחברות הסתיים בהצלחה.")
    this.setState({
      isConnected: true, muteVis: "visible",
      vidVis: "visible", create_btn_disable: true,
      join_btn_disable: true, send_btn_disable: false,
      input_disable: false, fullScreen: false
    });
    if (this.state.intervalFunc === null)
      this.setState({ intervalFunc: setInterval(this.intervalFunc, 1000) });
  }

  unavailableConnection = () => {
    clearTimeout(this.setState.timeoutDisconnected);
    var iceConnectionState = this.state.localPeer.iceConnectionState;
    if (iceConnectionState === "disconnected" || iceConnectionState === "checking") {
      clearInterval(this.state.intervalFunc);
      alert(this.props.linkedName + " חווה בעיית אינטרנט. נסו שוב מאוחר יותר.");
      this.hangUp(false);
    }
  }

  onReconnection = () => {
    this.setState({ disconFlag: false });
  }

  onCandidateDisconnected = () => {
    if (!this.state.disconFlag) {
      this.setState({
        timeoutDisconnected: setTimeout(this.unavailableConnection, 15000),
        disconFlag: true
      });
    }
  }

  checkCon = () => {
    clearTimeout(this.state.timeoutChecking);
    if (!this.state.isConnected) {
      clearInterval(this.state.intervalFunc);
      alert("תהליך ההתחברות נכשל. אנא נסה שוב בעוד מספר דקות.");
      this.hangUp(false);
    }
    else
      this.setState({ checkFlag: false });
  }

  onCandidateChecking = () => {
    if (!this.state.checkFlag)
      this.setState({
        timeoutChecking: setTimeout(this.checkCon, 10000),
        checkFlag: true, readyToJoin: true
      });
  }

  intervalFunc = () => {
    if (this.state.timer[4] !== 9)
      this.setState({
        timer: [this.state.timer[0],
        this.state.timer[1],
        this.state.timer[2],
        this.state.timer[3],
        this.state.timer[4] + 1]
      })
    else if (this.state.timer[4] === 9
      && this.state.timer[3] !== 5)
      this.setState({
        timer: [this.state.timer[0],
        this.state.timer[1],
        this.state.timer[2],
        this.state.timer[3] + 1, 0]
      });
    else if (this.state.timer[4] === 9 &&
      this.state.timer[3] === 5 &&
      this.state.timer[2] !== 9)
      this.setState({
        timer: [this.state.timer[0],
        this.state.timer[1],
        this.state.timer[2] + 1, 0, 0]
      });
    else if (this.state.timer[4] === 9 &&
      this.state.timer[3] === 5 &&
      this.state.timer[2] === 9 &&
      this.state.timer[1] !== 5)
      this.setState({
        timer: [this.state.timer[0],
        this.state.timer[1] + 1, 0, 0, 0]
      });
    else
      this.setState({
        timer: [this.state.timer[0] + 1, 0, 0, 0, 0]
      });
  }

  mute = () => {
    if (this.state.localStream.getAudioTracks()[0].enabled) {
      this.setState({ mute_icon: "blue" })
      this.state.localChannel.send(JSON.stringify({ mute: true }))
    }
    else {
      this.setState({ mute_icon: "black" })
      this.state.localChannel.send(JSON.stringify({ mute: false }))
    }
    this.state.localStream.getAudioTracks()[0].enabled = !(this.state.localStream.getAudioTracks()[0].enabled);
  }

  stopVideo = () => {
    if (this.state.localStream.getVideoTracks()[0].enabled) {
      this.setState({ video_icon: "blue" })
      this.state.localChannel.send(JSON.stringify({ video: true }))
    }
    else {
      this.setState({ video_icon: "black" })
      this.state.localChannel.send(JSON.stringify({ video: false }))
    }
    this.state.localStream.getVideoTracks()[0].enabled = !(this.state.localStream.getVideoTracks()[0].enabled);
  }

  handleDataChannel = async (dataChannelName) => {
    //creating data channel
    const dataPar = { ordered: true };
    this.setState({ localChannel: this.state.localPeer.createDataChannel(dataChannelName, dataPar) },
      () => {
        this.state.localChannel.binaryType = 'arraybuffer';
        this.state.localChannel.onopen = this.openDataChannel;
        this.state.localChannel.onclose = this.closedDataChannel;
        this.state.localPeer.ondatachannel = this.remoteOpenDataChannel;
      });
  }

  getMediaTracks = async () => {
    if (typeof (this.state.localStream) !== 'undefined') {
      this.state.localStream.getTracks()
        .forEach(track => this.state.localPeer
          .addTrack(track, this.state.localStream));
      console.log("Local stream has added to peer");
    }
  }

  getRemoteMediaTracks = async () => {
    this.state.localPeer.addEventListener('track', event => {
      console.log(`Got remote track: ${event.streams[0]}`);
      event.streams[0].getTracks().forEach(track => {
        console.log(`Added track to the remote stream: ${track}`);
        this.state.remoteStream.addTrack(track);
      });
    });
  }

  openDataChannel = async () => {
    console.log("Local channel has opened");
  }

  closedDataChannel = async () => {
    console.log("Local channel has closed");
    if (this.state.isConnected && !this.state.isFinished)
      alert("סיימת את השיחה. זמן השיחה: " +
        this.state.timer[0] + ":" + this.state.timer[1] + "" +
        this.state.timer[2] + ":" + this.state.timer[3] + "" +
        this.state.timer[4]);
  }

  remoteOpenDataChannel = async (event) => {
    event.preventDefault();
    this.setState({ remoteChannel: event.channel }, () => {
      this.state.remoteChannel.onmessage = this.getMessage;
    });
  }

  getMessage = async (event) => {
    event.preventDefault();
    var newMessage = JSON.parse(event.data);
    if (typeof (newMessage) === 'string')
      this.setState({ outMes: { mes: newMessage } });
    else if (newMessage.finish === true)
      this.setState({ isFinished: true }, this.mateDisconnected());
    else if (newMessage.mute === true)
      this.setState({ rem_mute_icon: "blue" });
    else if (newMessage.mute === false)
      this.setState({ rem_mute_icon: "black" });
    else if (newMessage.video === true)
      this.setState({ rem_video_icon: "blue" });
    else if (newMessage.video === false)
      this.setState({ rem_video_icon: "black" });
  }

  sendMessage = async (message) => {
    this.state.localChannel.send(JSON.stringify(message));
    console.log("The message was sent: " + message);
  }

  render() {
    return (
      <div className="main-vid-page" >

        <Video
          localRef={localVideo}
          remoteRef={remoteVideo}
          timer={this.state.timer}
          fullScreenDisable={this.state.fullScreen}
          userName={this.props.userName}
          linkedName={this.props.linkedName}
          isConnected={this.state.isConnected}
          readyToJoin={this.state.readyToJoin}
          disconnectionStat={this.state.disconFlag}
          mute_icon={this.state.mute_icon}
          video_icon={this.state.video_icon}
          rem_mute_icon={this.state.rem_mute_icon}
          rem_video_icon={this.state.rem_video_icon}
          mute_func={this.mute}
          stop_vid_func={this.stopVideo}
        />

        <Chat
          sendMessage={this.sendMessage}
          outMes={this.state.outMes}
          sendDisable={this.state.send_btn_disable}
          inputDisable={this.state.input_disable}
        />

        <VidButtons
          startVideo={this.startVideo}
          createRoom={this.createRoom}
          joinRoom={this.joinRoom}
          hangUp={() => this.hangUp(true)}
          muteVis={this.state.muteVis}
          vidVis={this.state.vidVis}
          mute={this.mute}
          stopVideo={this.stopVideo}
          startDisable={this.state.start_btn_disable}
          hangDisable={this.state.hang_btn_disable}
          createDisable={this.state.create_btn_disable}
          joinDisable={this.state.join_btn_disable}
          linkedName={this.props.linkedName}
        />
        <Credit />
      </div>
    );
  }
}

export default VideoPage;
