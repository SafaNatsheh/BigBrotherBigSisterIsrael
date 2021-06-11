import * as React from "react";
import "./WallPost.css";
import { Post } from "./post/Post";
import AddPicture from "./AddPicture";
import firebase, {auth} from "../../../config/Firebase"
import Loader from 'react-loader-spinner'

class WallPost extends React.Component {
  constructor() {
    super();
    this.showPicForm = false;
    this.postID = 0;
    this.Body = "";
    this.Image = [];
    this.ImageFiles = [];
    this.state = {
      postArray: [],
      textInput: "",
      textPictureInput: "",
      uploadProgress: 0,
      currId: 0,
      lastPostVisible: null,
      loadedAll: false,
      loadingPastPosts: false,
      uploadedPost: false
    };
    this.usersRef = firebase.firestore().collection('Users');
    this.cloudRef = firebase.storage().ref();
    this.userUid = firebase.auth().currentUser.uid;
  }

  getPosts = () => {
    var postsRef;
    var copyArray = [];
    this.usersRef.doc(this.userUid).get()
      .then(doc => {
        if (doc.data().type === 'חונך')
          postsRef = doc.ref.collection('Posts');
        else if (doc.data().type === 'חניך')
          postsRef = this.usersRef.doc(doc.data().link_user).collection('Posts');
      })
      .then(() => {
        postsRef
          .orderBy('timeStamp', 'desc')
          .limit(5)
          .get()
          .then(docs => {
            this.setState({ lastPostVisible: docs.docs[docs.docs.length - 1] }, () => {
              if (docs.empty)
                this.setState({ lastPostVisible: { timeStamp: ((Date.now() / 1000) - 7200) } })
              else if (typeof (this.state.lastPostVisible) === 'undefined')
                this.setState({ loadedAll: true })
            });
            var ind = 0;
            docs.forEach((doc) => {
              this.setState({ currId: this.postID + 1 });
              this.postID = this.postID + 1;
              var images = [];
              this.cloudRef.child('wall_pictures/' + doc.id).list()
                .then(pics => {
                  pics.items.forEach((pic, index) => {
                    pic.getDownloadURL()
                      .then(url => {
                        images.splice(index, 0, url)
                        if (images.length === pics.items.length) {
                          var uploadedPostObj = {
                            id: this.postID,
                            body: doc.data().text,
                            img: images,
                            timeStamp: doc.data().timeStamp,
                            uploader: doc.data().uploader,
                            doc_id: doc.id
                          }
                          Object.assign(copyArray, this.state.postArray);
                          copyArray.splice(ind, 0, uploadedPostObj);
                          copyArray.sort((a, b) => this.sortFunc(a, b));
                          this.setState({
                            postArray: [...copyArray]
                          });
                        }
                      })
                  })
                })
              if (!(doc.data().img)) {
                var uploadedPostObj = {
                  id: this.postID,
                  body: doc.data().text,
                  img: [],
                  timeStamp: doc.data().timeStamp,
                  uploader: doc.data().uploader,
                  doc_id: doc.id
                }
                Object.assign(copyArray, this.state.postArray);
                copyArray.splice(ind, 0, uploadedPostObj);
                copyArray.sort((a, b) => this.sortFunc(a, b));
                this.setState({
                  postArray: [...copyArray]
                });
              }
              ind++;
            })
          })
      })
      .catch(e => console.log(e.name));
  }

  readNewmessages = () => {
    var linkUser;
    var postsRef;
    this.usersRef.doc(this.userUid).get()
      .then(doc => {
        if (doc.data().type === 'חונך')
          postsRef = doc.ref.collection('Posts');
        else if (doc.data().type === 'חניך')
          postsRef = this.usersRef.doc(doc.data().link_user).collection('Posts');
        linkUser = doc.data().link_user;
      })
      .then(() => {
        postsRef
          .where('uploader', '==', linkUser)
          .where('unread', '==', true)
          .get()
          .then((docs) =>
            docs.forEach((doc) => doc.ref.update({ unread: false })))
      })
      .catch((e) => console.log(e.name));
  }

  componentDidMount() {
    auth.onAuthStateChanged(user=> {
      console.log(user)
      if (!user) {
        window.location.href = "/"
        return
      }
      this.readNewmessages();
      this.getPosts();
    })
  }

  sortFunc = (a, b) => {
    if (a.timeStamp > b.timeStamp)
      return 1;
    if (a.timeStamp < b.timeStamp)
      return -1;
    return 0;
  }

  /*חלון פרסום של מודעה חדשה*/
  deleteEvent = (index, doc_id) => {
    var con = window.confirm("האם אתה בטוח שברצונך למחוק את הפוסט?");
    if (!con)
      return;
    var postsRef;
    this.usersRef.doc(this.userUid).get()
      .then(doc => {
        if (doc.data().type === 'חונך')
          postsRef = doc.ref.collection('Posts');
        else if (doc.data().type === 'חניך')
          postsRef = this.usersRef.doc(doc.data().link_user).collection('Posts');
      })
      .then(() => {
        postsRef.doc(doc_id).delete();
        var picLen;
        this.cloudRef.child("wall_pictures/" + doc_id).list()
          .then(list => picLen = list.items.length)
          .then(() => {
            for (let i = 0; i < picLen; i++) {

              this.cloudRef.child("wall_pictures/" + doc_id + "/pic" + i).delete()
                .then(() => console.log("Post has deleted successfully"))
                .catch((e) => console.log(e.name));
            }
          })
          .catch((e) => console.log(e.name));
      })
      .catch((e) => console.log(e.name));

    const copyPostArray = Object.assign([], this.state.postArray);
    copyPostArray.splice(index, 1);
    this.setState({
      postArray: copyPostArray,
    });
  };

  setPost = (element) => {
    element.preventDefault();

    this.Body = this.state.textInput;
    this.Image = [];
    this.setState({ textInput: element.target.value });
  };

  setPicText = (text) => {
    this.setState({ textPictureInput: text });
    this.Body = this.state.textPictureInput;
  };

  setImagePost = (pictures, url) => {
    this.ImageFiles = pictures;
    this.Image = url;
    this.Body = this.state.textPictureInput;

    this.setState({ textPictureInput: "" });
    this.addPost();
  };

  addPost = () => {
    if (this.state.textInput === "" && this.state.textPictureInput === "" && this.Image.length === 0) {
      alert("יש להכניס טקסט ליצירת פרסום");
      return;
    }
    if (this.state.uploadedPost)
      return;
    this.setState({ uploadedPost: true })
    var postDocId;

    var postObj = {
      uploader: this.userUid,
      timeStamp: Date.now(),
      text: this.Body,
      img: this.Image.length !== 0,
      unread: true
    }
    var postsRef;
    this.usersRef.doc(this.userUid).get()
      .then(doc => {
        if (doc.data().type === 'חונך')
          postsRef = doc.ref.collection('Posts');
        else if (doc.data().type === 'חניך')
          postsRef = this.usersRef.doc(doc.data().link_user).collection('Posts');

        postsRef
          .add(postObj)
          .then(doc => {
            postDocId = doc.id;
            this.setState({ currId: this.postID + 1 });
            this.postID = this.postID + 1;
            const copyPostArray = Object.assign([], this.state.postArray);
            copyPostArray.push({
              id: this.postID,
              body: this.Body,
              img: this.Image,
              timeStamp: Date.now(),
              uploader: this.userUid,
              doc_id: postDocId
            });
            this.setState({
              postArray: copyPostArray,
            });
          })
          .then(() => {
            for (let i = 0; i < this.ImageFiles.length; i++) {
              if (postObj.img)
                var a = this.cloudRef.child("wall_pictures/" + postDocId + "/pic" + i).put(this.ImageFiles[i]);
              try {
                a.on('state_changed', (snapshot) => {
                  this.setState({ uploadProgress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100 });

                })
              }
              catch (e) {
                console.log(e.name);
              }
            }
          })
          .then(() => {
            this.setState({ textInput: "" });
            this.body = "";
            this.Image = [];
            this.setState({ uploadedPost: false });
            this.ImageFiles = [];
          })
      })
      .catch((e) => console.log(e.name));
  };
  /*^חלון פרסום של מודעה חדשה^*/

  AddPic = () => {
    this.setState({
      showPicForm: true,
    });
  };

  //the funtion that the child will active
  callbackForm = (formData) => {
    this.setState({ showPicForm: formData });
  };

  loadMorePosts = () => {
    if (typeof (this.state.lastPostVisible) === 'undefined' || this.state.lastPostVisible === null)
      return;
    var startFrom;
    var copyArray = [];
    if (typeof (this.state.lastPostVisible.timeStamp) === 'undefined')
      startFrom = this.state.lastPostVisible.data().timeStamp;
    else
      startFrom = this.state.lastPostVisible.timeStamp;
    this.setState({ loadingPastPosts: true });
    var postsRef;
    this.usersRef.doc(this.userUid).get()
      .then(doc => {
        if (doc.data().type === 'חונך')
          postsRef = doc.ref.collection('Posts');
        else if (doc.data().type === 'חניך')
          postsRef = this.usersRef.doc(doc.data().link_user).collection('Posts');
      })
      .then(() => {
        postsRef
          .orderBy("timeStamp", "desc")
          .startAfter(startFrom)
          .limit(5)
          .get()
          .then((querySnap) => {
            if (querySnap.docs.length < 5)
              this.setState({ loadedAll: true })
            if (querySnap.docs.length === 0)
              return;
            this.setState({ lastPostVisible: querySnap.docs[querySnap.docs.length - 1] });
            var ind = 0;
            querySnap.forEach((doc) => {
              this.setState({ currId: this.postID + 1 });
              this.postID = this.postID + 1;
              var images = [];
              this.cloudRef.child('wall_pictures/' + doc.id).list()
                .then(pics => {
                  pics.items.forEach((pic, index) => {
                    pic.getDownloadURL()
                      .then(url => {
                        images.splice(index, 0, url)
                        if (images.length === pics.items.length) {
                          var uploadedPostObj = {
                            id: this.postID,
                            body: doc.data().text,
                            img: images,
                            timeStamp: doc.data().timeStamp,
                            uploader: doc.data().uploader,
                            doc_id: doc.id
                          }
                          Object.assign(copyArray, this.state.postArray);
                          copyArray.splice(ind, 0, uploadedPostObj);
                          copyArray.sort((a, b) => this.sortFunc(a, b));
                          this.setState({
                            postArray: [...copyArray]
                          });
                        }
                      })
                  })
                })
              if (!(doc.data().img)) {
                var uploadedPostObj = {
                  id: this.postID,
                  body: doc.data().text,
                  img: [],
                  timeStamp: doc.data().timeStamp,
                  uploader: doc.data().uploader,
                  doc_id: doc.id
                }
                Object.assign(copyArray, this.state.postArray);
                copyArray.splice(ind, 0, uploadedPostObj)
                copyArray.sort((a, b) => this.sortFunc(a, b));
                this.setState({
                  postArray: [...copyArray]
                });
              }
              ind++;
            })
          })
          .then(() => this.setState({ loadingPastPosts: false }))
          .catch((e) => console.log(e.name))
      });
  }
  render() {
    return (
      /* Page Container*/
      <div className="page-container" >
        <div className="wall-post-main">
          <div className="wall-new-post">
            <div className="wall-post-top">
              צור פרסום</div>
            <div className="wall-post-tip">
              (לפתיחת חלונית אימוג'י של הדפדפן לחץ על מקש נקודה (./ץ) ועל מקש Windows יחדיו)</div>
            <div className="wall-post-mid">
              <input
                className="form-control"
                type="text"
                onBlur={this.setPost}
                placeholder="כתוב פרסום.."
                value={this.state.textInput}
                onChange={(e) => this.setState({ textInput: e.target.value })}
              />
            </div>
            <div className="wall-post-footer">
              <button className="btn btn-success wall-post-b-a" onClick={this.AddPic}>
                צרף תמונה
              </button>
              <button className="btn btn-success wall-post-b-p" onClick={this.addPost}>
                פרסם
              </button>
            </div>
          </div>

          <div className="wall-post-list">

            {this.state.postArray.map((post, index) => {
              return (
                <Post
                  myProfilePic={this.props.myProfilePic}
                  friendProfilePic={this.props.friendProfilePic}
                  userName={this.props.userName}
                  friendName={this.props.friendName}
                  key={"post" + index}
                  id={post.id}
                  body={post.body}
                  img={post.img}
                  doc_id={post.doc_id}
                  timeStamp={post.timeStamp}
                  uploader={post.uploader}
                  delete={this.deleteEvent.bind(this, index, post.doc_id)}
                  uploadProgress={this.state.uploadProgress}
                  currId={this.state.currId}
                />
              );
            }).reverse()}
          </div>
          <button className="btn btn-primary load-more-posts" disabled={this.state.loadedAll} onClick={this.loadMorePosts}>טען פוסטים נוספים</button>
          <Loader className="loader-past-posts" type="TailSpin" height="30px" width="30px" color="royalblue" visible={this.state.loadingPastPosts}></Loader>
        </div>
        {this.state.showPicForm ? (
          <AddPicture
            parentCallback={this.callbackForm}
            setImagePostParent={this.setImagePost}
            setPicText={this.setPicText}
            showText={true}
          />
        ) : null
        }
      </div >
    );
  }
}

export default WallPost;