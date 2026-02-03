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
    // New Fields
    subDiscipline: '',
    researchInterests: '',
    languages: '',
    highestDegree: '',
    yearsOfExperience: '',
    skills: '',
    lookingToPost: false,
    lookingToJoin: false,
    timeAvailability: '',
    website: '',
    linkedin: '',
    twitter: '',
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
            // Populate new fields
            subDiscipline: p.sub_discipline || '',
            researchInterests: Array.isArray(p.research_interests) ? p.research_interests.join(', ') : (p.research_interests || ''),
            languages: Array.isArray(p.languages) ? p.languages.join(', ') : (p.languages || ''),
            highestDegree: p.highest_degree || '',
            yearsOfExperience: p.years_of_experience || '',
            skills: Array.isArray(p.skills) ? p.skills.join(', ') : (p.skills || ''),
            lookingToPost: p.looking_to_post || false,
            lookingToJoin: p.looking_to_join || false,
            timeAvailability: p.time_availability || '',
            website: p.website || '',
            linkedin: p.linkedin || '',
            twitter: p.twitter || '',
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    })();
  }, [userId]);

  // 3. FIELD CHANGE HANDLER
  const handleChange = ({ target: { name, value, type, checked, files } }) => {
    if (name === 'profilePicture') {
      // setProfile((prev) => ({ ...prev, profilePicture: files[0] }));
      toast.info("Image upload is currently disabled.");
    } else {
      setProfile((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
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
        // New Fields
        subDiscipline: profile.subDiscipline,
        researchInterests: profile.researchInterests.split(',').map(s => s.trim()).filter(Boolean),
        languages: profile.languages.split(',').map(s => s.trim()).filter(Boolean),
        highestDegree: profile.highestDegree,
        yearsOfExperience: profile.yearsOfExperience ? parseInt(profile.yearsOfExperience) : null,
        skills: profile.skills.split(',').map(s => s.trim()).filter(Boolean),
        lookingToPost: profile.lookingToPost,
        lookingToJoin: profile.lookingToJoin,
        timeAvailability: profile.timeAvailability,
        website: profile.website,
        linkedin: profile.linkedin,
        twitter: profile.twitter,
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
