import React from 'react';
import { useRouter } from 'next/router';
import useGetData from '../../custom-hooks/useGetData';

const AdminDashboard = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: products } = useGetData('events');
  const { data: assets } = useGetData('jobbooking');
  const { data: users } = useGetData('users');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
     {/* <div className="bg-gradient-to-r from-blue-500 to-red-500 mr-2 ml-2 md:mr-0 md:ml-0 border-4 border-white rounded-lg flex flex-col justify-center min-h-[107px] md:min-h-[130px] text-center transition-all duration-300 ease-in-out hover:shadow-[0px_11px_30px_rgba(51,83,145,0.07)] hover:border-transparent">
        <p className="font-medium text-[1rem] md:text-[17px] leading-[1.77] text-white">Total Job Bookings</p>
        <span className="text-white font-black text-[1rem] md:text-[15px] leading-[2]">{products.length}</span>
  </div> */}
      <div className="bg-gradient-to-r from-blue-500 to-red-500 mr-2 ml-2 md:mr-0 md:ml-0 border-4 border-white rounded-lg flex flex-col justify-center min-h-[107px] md:min-h-[130px] text-center transition-all duration-300 ease-in-out hover:shadow-[0px_11px_30px_rgba(51,83,145,0.07)] hover:border-transparent">
        <p className="font-medium text-[1rem] md:text-[17px] leading-[1.77] text-white">Total Job Bookings</p>
        <span className="text-white font-black text-[1rem] md:text-[15px] leading-[2]">{assets.length}</span>
      </div> 
      <div className="bg-gradient-to-r from-blue-500 to-red-500 mr-2 ml-2 md:mr-0 md:ml-0 border-4 border-white rounded-lg flex flex-col justify-center min-h-[107px] md:min-h-[130px] text-center transition-all duration-300 ease-in-out hover:shadow-[0px_11px_30px_rgba(51,83,145,0.07)] hover:border-transparent">
        <p className="font-medium text-[1rem] md:text-[17px] leading-[1.77] text-white">Total Users</p>
        <span className="text-white font-black text-[1rem] md:text-[15px] leading-[2]">{users.length}</span>
      </div>
    </div>
  );
};

export default AdminDashboard;
