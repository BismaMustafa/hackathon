import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Import Firestore from your firebase configuration file
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

const Post = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [uploads, setUploads] = useState([]);
  const [title, setTitle] = useState(''); // State for the title
  const [description, setDescription] = useState(''); // State for the description
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(''); // Error state
  const [editingId, setEditingId] = useState(null); // ID of the item being edited

  useEffect(() => {
    const fetchUploads = async () => {
      const uploadsCollection = collection(db, 'uploads');
      const uploadsSnapshot = await getDocs(uploadsCollection);
      const uploadsList = uploadsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUploads(uploadsList);
    };

    fetchUploads();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile.name);
  };

  const handleUpload = async () => {
    if (!file || !title) {
      setError('Please select a file and enter a title.'); // Check for file and title
      return;
    }
    setError(''); // Clear previous errors
    setLoading(true); // Set loading state

    const fileUrl = URL.createObjectURL(file); // Create a local URL for the file

    try {
      const docRef = await addDoc(collection(db, 'uploads'), {
        name: fileName,
        url: fileUrl,
        title,
        description,
      });
      alert('File uploaded successfully!');
      setUploads((prevUploads) => [
        ...prevUploads,
        { id: docRef.id, name: fileName, url: fileUrl, title, description },
      ]);
      // Clear input fields after upload
      setTitle('');
      setDescription('');
      setFile(null);
      setFileName('');
    } catch (error) {
      setError('Error uploading file: ' + error.message); // Handle upload error
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'uploads', id));
      setUploads((prevUploads) => prevUploads.filter((upload) => upload.id !== id));
      alert('File deleted successfully!');
    } catch (error) {
      setError('Error deleting file: ' + error.message); // Handle delete error
      console.error('Error deleting file:', error);
    }
  };

  const handleEdit = (upload) => {
    setEditingId(upload.id);
    setTitle(upload.title);
    setDescription(upload.description);
    setFile(null); // Reset file for editing
  };

  const handleUpdate = async () => {
    if (!editingId || !title) {
      setError('Please enter a title.'); // Check for title
      return;
    }
    setError(''); // Clear previous errors

    try {
      const uploadRef = doc(db, 'uploads', editingId);
      await updateDoc(uploadRef, {
        title,
        description,
      });
      setUploads((prevUploads) =>
        prevUploads.map((upload) =>
          upload.id === editingId ? { ...upload, title, description } : upload
        )
      );
      alert('File updated successfully!');
      setEditingId(null); // Reset editing state
      setTitle('');
      setDescription('');
    } catch (error) {
      setError('Error updating file: ' + error.message); // Handle update error
      console.error('Error updating file:', error);
    }
  };

  return (
    <div className="post-component p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Upload a File</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-2 border rounded-md p-2 w-full"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mb-2 border rounded-md p-2 w-full"
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-2 p-2"
      />
      <button
        onClick={editingId ? handleUpdate : handleUpload}
        className={`mb-4 w-full bg-blue-500 text-white rounded-md p-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={loading}
      >
        {loading ? 'Uploading...' : (editingId ? 'Update' : 'Upload')}
      </button>

      <h3 className="text-lg font-semibold mb-2">Uploaded Files:</h3>
      <ul>
        {uploads.map((upload) => (
          <li key={upload.id} className="flex items-center mb-4 border-b pb-2">
            <div className="mr-4">
              <strong>{upload.title}</strong>
              <p>{upload.description}</p>
            </div>
            {/* Display the uploaded image */}
            {upload.url && (
              <img src={upload.url} alt={upload.name} className="w-16 h-16 object-cover ml-2" />
            )}
            <button onClick={() => handleEdit(upload)} className="ml-2 text-blue-500">
              Edit
            </button>
            <button onClick={() => handleDelete(upload.id)} className="ml-2 text-red-500">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Post;
