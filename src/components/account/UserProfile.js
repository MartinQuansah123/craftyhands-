import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { db } from '../../firebase.config'; // Make sure to configure your Firebase
import { doc, getDoc } from 'firebase/firestore';

const UserProfile = () => {
  const router = useRouter();
  const { id } = router.query;

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        const userDoc = await getDoc(doc(db, 'users', id));
        if (userDoc.exists()) {
          setUser(userDoc.data());

          // Check user type and redirect accordingly
          if (!user.accountType === "Employer" && user.accountType === "Mini Admin") {
            router.push(`/dashboard/${id}/dashboard`);
          } else if (!user.accountType === "Employer" && user.accountType === "Super Admin") {
            router.push(`/my-admin/${id}/dashboard`);
          } else if (!user.accountType === "Employee" && user.accountType === "Mini Admin") {
            router.push(`/dashboard/${id}/dashboard`);
          } else if (!user.accountType === "Employee" && user.accountType === "Super Admin") {
            router.push(`/my-admin/${id}/dashboard`);
          }

        }
      };

      fetchUser();
    }
  }, [id]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{user.displayName}&apos;s Profile</h1>
      <p className="mb-2"><strong>Email:</strong> {user.email}</p>
      <p className="mb-2"><strong>Occupation:</strong> {user.occupation}</p>
      <p className="mb-2"><strong>Address:</strong> {user.address}</p>
      <h2 className="text-xl font-semibold mt-4 mb-2">Skills</h2>
      <div className="flex flex-wrap">
        {user.skills.map((skill, index) => (
          <div key={index} className="bg-blue-500 text-white rounded-full px-4 py-1 m-1">
            {skill}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
