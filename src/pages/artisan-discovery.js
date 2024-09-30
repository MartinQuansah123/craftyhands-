import { useState, useEffect } from 'react';
import { db } from '../firebase.config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import Layout from '@/components/Home/layout';

const ArtisanDiscovery = () => {
  const [artisans, setArtisans] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRandomArtisans();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      handleSearch();
    } else {
      fetchRandomArtisans();
    }
  }, [searchTerm]);

  const fetchRandomArtisans = async () => {
    const artisanQuery = query(collection(db, 'users'), 
      where('accountType', '==', 'Artisan'), 
      where('status', '==', 'Verified')
    );
    const artisanSnapshot = await getDocs(artisanQuery);
    const artisanList = artisanSnapshot.docs.map(doc => doc.data());
    setArtisans(artisanList.sort(() => 0.5 - Math.random()).slice(0, 9));
  };

  const handleSearch = async () => {
    const searchLower = searchTerm.toLowerCase();
    const artisanQuery = query(collection(db, 'users'), 
      where('accountType', '==', 'Artisan'), 
      where('status', '==', 'Verified')
    );
    const artisanSnapshot = await getDocs(artisanQuery);
    const artisanList = artisanSnapshot.docs.map(doc => doc.data()).filter(artisan => 
      artisan.address.toLowerCase().includes(searchLower) ||
      artisan.businessName.toLowerCase().includes(searchLower) ||
      artisan.displayName.toLowerCase().includes(searchLower) ||
      artisan.workPeriod.toLowerCase().includes(searchLower) ||
      artisan.skills.some(skill => skill.toLowerCase().includes(searchLower))
    );
    setArtisans(artisanList);
  };

  const getHighlightedSkills = (skills, searchSkill) => {
    const lowerCaseSearchSkill = searchSkill.toLowerCase();
    const filteredSkills = skills.filter(skill => skill.toLowerCase().includes(lowerCaseSearchSkill));
    const otherSkills = skills.filter(skill => !skill.toLowerCase().includes(lowerCaseSearchSkill));
    return [...filteredSkills, ...otherSkills].slice(0, 3);
  };

  return (
    <Layout>
      <div className="container">
        <div className="relative bg-cover bg-center shadow py-10 w-[100%]"
          style={{ backgroundImage: "url('https://images.squarespace-cdn.com/content/v1/5d03dea6992449000176121b/d53bb826-f6c1-48cf-8161-2c6f0de80e88/PHOTO-2023-08-10-04-12-13.jpg')" }}>
          <h1 className="text-3xl font-bold mb-8 text-center text-white">Discover Artisans</h1>
          <div className="mb-8 flex justify-center">
            <input
              type="text"
              placeholder="Search by address, business name, display name, work period, or skills"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-2 rounded w-full md:max-w-lg mx-2"
            />
          </div>
        </div>
        {artisans.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-1 mt-5 px-1 md:mx-1">
            {artisans.map((artisan, index) => (
              <Link href={`/profile/${artisan.uid}`} key={index}
              className='bg-cover bg-center rounded-lg'
              style={{ backgroundImage: "url('https://images.squarespace-cdn.com/content/v1/5d03dea6992449000176121b/d53bb826-f6c1-48cf-8161-2c6f0de80e88/PHOTO-2023-08-10-04-12-13.jpg')" }}>
                <div className="w-full max-w-sm  bg-white bg-opacity-90 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 cursor-pointer">
                  <div className="flex flex-col items-center pb-10">
                    <img className="w-24 h-24 mb-3 rounded-full shadow-lg mt-1" src={artisan.photoURL} alt="image" />
                    <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{artisan.displayName}</h5>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {getHighlightedSkills(artisan.skills, searchTerm).map((skill, idx) => (
                        <span 
                          key={idx} 
                          className={`px-2 py-1 rounded  ${skill.toLowerCase().includes(searchTerm.toLowerCase()) ? 'bg-yellow-200 text-yellow-800' : 'bg-rose-200 text-rose-800'}`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 font-semibold dark:text-gray-400 p-2">{artisan.address}</span>
                    <div className="flex mt-4 md:mt-6">
                      <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-rose-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Hire Artisan</button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-4">No Artisan Found</p>
        )}
      </div>
    </Layout>
  );
};

export default ArtisanDiscovery;
