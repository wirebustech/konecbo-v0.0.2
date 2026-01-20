// researcherEditProfileLogic.js
// Backend logic for EditProfile (data fetching, updating, and auth)

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { toast } from 'react-toastify';

export const useEditProfileLogic = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    title: '',
    name: '',
    email: '',
    researchArea: '',
    biography: '',
    profilePicture: null,
    university: '',
    country: '',
  });

  const [userId, setUserId] = useState(null);

  // 1. TOKEN / AUTH GUARD
  useEffect(() => {
    const token = authService.getToken();
    if (!token) {
      navigate('/signin');
      return;
    }

    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUserId(currentUser.id || 'user');
    } else {
      // Validation check via API
      authService.getProfile().then(p => {
        if (p && p.user) setUserId(p.user.id);
      }).catch(() => navigate('/signin'));
    }
  }, [navigate]);

  // 2. FETCH EXISTING PROFILE DATA
  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const sqlProfile = await authService.getProfile();
        if (sqlProfile && sqlProfile.user) {
          const p = sqlProfile.user;
          setProfile({
            title: p.current_position || '',
            name: p.full_name || '',
            email: p.email || '',
            researchArea: p.primary_discipline || '',
            biography: p.bio || '',
            profilePicture: null, // Image upload unavailable
            university: p.institution || '',
            country: p.country || '',
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    })();
  }, [userId]);

  // 3. FIELD CHANGE HANDLER
  const handleChange = ({ target: { name, value, files } }) => {
    if (name === 'profilePicture') {
      // setProfile((prev) => ({ ...prev, profilePicture: files[0] }));
      toast.info("Image upload is currently disabled.");
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 4. FORM SUBMIT HANDLER
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const profileData = {
        fullName: profile.name,
        currentPosition: profile.title,
        institution: profile.university,
        country: profile.country,
        primaryDiscipline: profile.researchArea,
        bio: profile.biography,
      };

      try {
        await authService.updateProfile(profileData);
        toast.success("Profile updated successfully!");
        navigate('/researcher-profile');
        return true;
      } catch (err) {
        console.error('Error updating your profile:', err);
        toast.error("Failed to update profile.");
        return false;
      }
    },
    [profile, navigate]
  );

  // 5. LOG-OUT HANDLER
  const handleLogout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Error signing out:', err);
    } finally {
      navigate('/signin');
    }
  }, [navigate]);

  // 6. PUBLIC API
  return {
    profile,
    setProfile,
    userId,
    handleChange,
    handleSubmit,
    handleLogout,
  };
};
