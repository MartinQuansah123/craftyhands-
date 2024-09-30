import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase.config';
import { onAuthStateChanged } from "firebase/auth";
import { toast } from 'react-toastify';

const UserCheckpoint = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkVerificationStatus = async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    if (userData.status === 'Verified') {
                        let returnUrl;
                        if (userData.accountType === "Super Admin") {
                            returnUrl = `/my-admin/${user.uid}/dashboard`;
                        } else if (userData.accountType === "Mini Admin") {
                            returnUrl = `/dashboard/${user.uid}/dashboard`;
                        } else if (userData.accountType === "Artisan") {
                            toast.success("Your account has been verified");
                            returnUrl = `/account/${user.uid}/dashboard`;
                        } else if (userData.accountType === "Client") {
                            toast.success("Your account has been verified");
                            returnUrl = `/account/${user.uid}/dashboard`;
                        } else {
                            returnUrl = '/';
                        }
                        router.push(returnUrl);
                    } else {
                        setLoading(false);
                    }
                } else {
                    toast.error('User data not found');
                }
            } else {
                router.push('/signin');
            }
        };

        onAuthStateChanged(auth, checkVerificationStatus);
    }, [router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="md:max-w-4xl md:px-4 md:py-10 pb-10  lg:px-8 lg:py-14 mx-auto">
            <p className="text-md md:text-2xl lg:text-2xl font-semibold mx-3 p-5 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-black">
                Your account is under review.
                You will gain access after your account is verified.
                Thank you for your patience.
          </p>
        </div>
    );
};

export default UserCheckpoint;
