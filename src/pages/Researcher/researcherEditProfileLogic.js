
// researcherEditProfileLogic.js
// Backend logic for EditProfile (data fetching, updating, and auth)

import { useState, useEffect, useCallback } from 'react';
import { db, auth, storage } from '../../config/firebaseConfig';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

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
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/signin');
      return;
    }

    // Check generic auth service first (SQL or Google)
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUserId(currentUser.id || currentUser.uid); // SQL users have 'id', Firebase users mapped might use 'uid'
    }

    // Also check Firebase generic auth state listener for purely Firebase users
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else if (!currentUser) {
        // Only redirect if NEITHER exist
        // But if we have a token, we might be valid. 
        // We rely on authService.getCurrentUser() as the source of truth for our app login.
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // 2. FETCH EXISTING PROFILE DATA
  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        // Try SQL Backend first (Unified source)
        try {
          const sqlProfile = await authService.getProfile();
          if (sqlProfile && sqlProfile.user) {
            const p = sqlProfile.user; // Profile data is merged in user object by getProfile controller
            setProfile({
              title: p.current_position || '', // Mapping title to current_position or use new field? SQL has user_profiles.current_position. EditProfile uses 'titles' array which are salutations. Let's map to 'current_position' loosely or create a field.
              name: p.full_name || '',
              email: p.email || '',
              researchArea: p.primary_discipline || (p.research_interests && p.research_interests[0]) || '',
              biography: p.bio || '',
              profilePicture: p.profile_picture || null, // We need to add this column to SQL or use existing
              university: p.institution || '',
              country: p.country || '',
            });
            return; // Found in SQL, stop here
          }
        } catch (sqlErr) {
          // If SQL fails or 404, fall back to Firestore
          console.log("SQL Profile fetch failed, trying Firestore", sqlErr);
        }

        // Fallback to Firestore
        const profileDocRef = doc(db, 'researcherProfiles', userId);
        const userDoc = await getDoc(profileDocRef);
        if (userDoc && typeof userDoc.exists === 'function' && userDoc.exists()) {
          const data = userDoc.data();
          setProfile({
            title: data.title || '',
            name: data.name || '',
            email: data.email || '',
            researchArea: data.researchArea || '',
            biography: data.biography || '',
            profilePicture: data.profilePicture || null,
            university: data.university || '',
            country: data.country || '',
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
      setProfile((prev) => ({ ...prev, profilePicture: files[0] }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 4. FORM SUBMIT HANDLER
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        // Upload picture first if it's a file
        let profilePicUrl = profile.profilePicture;

        // Only attempt Firebase Storage upload if we have an auth.currentUser (Firebase Auth)
        // SQL-only users might need a different upload endpoint, but we'll skip image upload for them now or handle differently.
        if (
          profile.profilePicture &&
          (profile.profilePicture instanceof File || profile.profilePicture instanceof Blob) &&
          auth.currentUser
        ) {
          const storageRef = ref(storage, `profilePictures/${userId}`);
          await uploadBytes(storageRef, profile.profilePicture);
          profilePicUrl = await getDownloadURL(storageRef);
        }

        // Update SQL Backend
        const profileData = {
          fullName: profile.name,
          currentPosition: profile.title,
          institution: profile.university,
          country: profile.country,
          primaryDiscipline: profile.researchArea,
          bio: profile.biography,
          // profilePicture: profilePicUrl 
        };

        try {
          await authService.updateProfile(profileData);
          navigate('/researcher-profile');
          return true;
        } catch (sqlErr) {
          console.error("SQL update failed, trying Firestore", sqlErr);
        }

        // Update Firestore (Fallback/Dual-write)
        // ... (Existing Firestore logic)

        const firestoreData = { ...profile, profilePicture: profilePicUrl };
        // Cleanup undefined
        Object.keys(firestoreData).forEach((k) => {
          if (typeof firestoreData[k] === 'undefined') firestoreData[k] = null;
        });
        await setDoc(doc(db, 'researcherProfiles', userId), firestoreData, {
          merge: true,
        });
        navigate('/researcher-profile');
        return true;

      } catch (err) {
        console.error('Error updating your profile:', err);
        return false;
      }
    },
    [profile, userId, navigate]
  );

  // 5. LOG-OUT HANDLER
  const handleLogout = useCallback(async () => {
    try {
      await authService.logout(); // Call our service which handles both SQL/Storage clearing
      if (auth.currentUser) {
        await auth.signOut();
      }
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
