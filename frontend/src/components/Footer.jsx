import React from 'react';

const Footer = () => {
  return (
    <div>
         <div className='bg-walmartBlue bg-opacity-25  text-center mt-10'>
         <div className="h-36 p-10">
         <h2 className="text-md font-sans ">We’d love to hear what you think!</h2>
          <button className="bg-white border-black text-walmartBlue px-4 py-2 mt-2 rounded-full border-2 ease-in-out transition duration-300">
            Give feedback
          </button>
         </div>
    <div className="bg-sky-900 text-white py-8 font-sans text-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <h3 className="font-sans mb-2 text-sm">All Departments</h3>
            <ul className="space-y-1">
              <li>Store Directory</li>
              <li>Careers</li>
              <li>Our Company</li>
              <li>Sell on Walmart.com</li>
              <li>Help</li>
            </ul>
          </div>
          <div >
            <h3 className="font-sans mb-2 text-sm">Product Recalls</h3>
            <ul className="space-y-1">
              <li>Accessibility</li>
              <li>Tax Exempt Program</li>
              <li>Get the Walmart App</li>
              <li>Sign-up for Email</li>
              <li>Safety Data Sheet</li>
            </ul>
          </div>
          <div>
            <h3 className="font-sans mb-2 text-sm">Terms of Use</h3>
            <ul className="space-y-1">
              <li>Privacy & Security</li>
              <li>India Supply Chain Act</li>
              <li>Privacy choices</li>
              <li>Notice at Collection</li>
              <li>NV Consumer Health Data Privacy Notice</li>
            </ul>
          </div>
          <div>
            <h3 className="font-sans mb-2 text-sm">WA Consumer Health Data Privacy Notice</h3>
            <ul className="space-y-1">
              <li>Request My Personal Information</li>
              <li>Brand Shop Directory</li>
              <li>Pharmacy</li>
              <li>Walmart Business</li>
              <li>Walmart Careers</li>
            </ul>
          </div>
          <div>
            <h3 className="font-sans mb-2 text-sm">Delete Account</h3>
            <ul className="space-y-1">
              <li>Walmart location</li>
              <li>Clothings</li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-8 text-sm">
          <p>© 2024 Code Commanders. All Rights Reserved.</p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Footer;
