import React, { useState } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AddPost = () => {
  const [content, setContent] = useState("");
  const [type, setType] = useState("recipe");

  const handleAddPost = async () => {
    await addDoc(collection(db, "posts"), {
      type,
      content,
      timestamp: serverTimestamp(),
    });
    setContent("");
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const storageRef = ref(storage, `photos/${file.name}`);
      await uploadBytes(storageRef, file);
      const photoUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, "posts"), {
        type: "photo",
        content: photoUrl,
        timestamp: serverTimestamp(),
      });
    }
  };

  return (
    <div>
      <textarea
        placeholder="Write something..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="recipe">Recipe</option>
        <option value="idea">Idea</option>
        <option value="list">List</option>
      </select>
      <button onClick={handleAddPost}>Add Post</button>
      <input type="file" onChange={handleUploadPhoto} />
    </div>
  );
};

export default AddPost;
