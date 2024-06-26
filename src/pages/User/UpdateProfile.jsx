import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UpdateProfile() {
  const [profileImage, setProfileImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;

    axios.get('http://localhost/proyectoDaw/public/api/get.profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        setProfileImage(response.data.profileImage);
      })
      .catch(error => {
        console.error('Error fetching the profile image:', error);
      });
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);

      // Create a preview of the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedImage) {
      console.error('No image selected');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result.split(',')[1];

      axios.put('http://localhost/proyectoDaw/public/api/update.profile', { profile_image: base64Image }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          setProfileImage(response.data.profileImage);
          console.log(response.data);
        })
        .catch(error => {
          console.error('Error updating the profile image:', error);
        });
    };
    reader.readAsDataURL(selectedImage);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="profile_image">Imagen de Perfil</label>
          <input
            type="file"
            name="profile_image"
            id="profile_image"
            onChange={handleImageChange}
          />
        </div>

        {imagePreview && (
          <img src={imagePreview} alt="Image Preview" style={{ marginTop: '20px', maxWidth: '200px' }} />
        )}

        <button type="submit">Actualizar Perfil</button>
      </form>

      {profileImage && (
        <img
          src={`http://localhost/proyectoDaw/public/storage/profile_images/${profileImage}`}
          alt="Imagen de Perfil"
          style={{ marginTop: '20px' }}
        />
      )}
    </div>
  );
}

export default UpdateProfile;
