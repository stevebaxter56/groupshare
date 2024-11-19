import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import AddPost from "./AddPost";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h2>Group Sharing</h2>
      <AddPost />
      <div>
        {posts.map((post) => (
          <div key={post.id}>
            <h4>{post.type}</h4>
            {post.type === "photo" ? (
              <img src={post.content} alt="Uploaded" style={{ maxWidth: "200px" }} />
            ) : (
              <p>{post.content}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
