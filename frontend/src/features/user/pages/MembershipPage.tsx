import React, { useState } from "react";
import Navbar from "../../../components/Navbar"; // Reusing your Navbar component
import Footer from "../../../components/Footer"; // Reusing your Footer component

const MembershipPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  // FAQ toggle state (optional interactivity)
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleFaqToggle = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="bg-gray-50 font-inter min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="pt-16">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Path to Fitness</h1>
            <p className="text-xl text-gray-600">Flexible plans designed to fit your lifestyle and fitness goals</p>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-lg shadow-sm p-1 inline-flex">
              <button
                className={`px-6 py-2 text-sm font-medium rounded-lg ${
                  billingCycle === "monthly" ? "bg-blue-600 text-white" : "text-gray-700 hover:text-blue-600"
                }`}
                onClick={() => setBillingCycle("monthly")}
              >
                Monthly
              </button>
              <button
                className={`px-6 py-2 text-sm font-medium rounded-lg ${
                  billingCycle === "annual" ? "bg-blue-600 text-white" : "text-gray-700 hover:text-blue-600"
                }`}
                onClick={() => setBillingCycle("annual")}
              >
                Annual
              </button>
            </div>
          </div>

          {/* Membership Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Basic Plan */}
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Basic</h3>
                  <p className="text-gray-500">Monthly membership</p>
                </div>
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">Popular</span>
              </div>
              <div className="mb-6">
                <p className="text-4xl font-bold text-gray-900">
                  {billingCycle === "monthly" ? "$49" : "$39"}
                  <span className="text-lg font-normal text-gray-500">/mo</span>
                </p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <i className="fas fa-check text-blue-600 mr-3"></i>
                  <span className="text-gray-600">Access to all basic equipment</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-blue-600 mr-3"></i>
                  <span className="text-gray-600">Standard gym hours</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-blue-600 mr-3"></i>
                  <span className="text-gray-600">Locker room access</span>
                </li>
              </ul>
              <button className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700">
                Select Plan
              </button>
            </div>

            {/* Premium Plan */}
            <div className="bg-white rounded-xl shadow-sm p-8 border-2 border-blue-600">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Premium</h3>
                  <p className="text-gray-500">Monthly membership</p>
                </div>
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">Best Value</span>
              </div>
              <div className="mb-6">
                <p className="text-4xl font-bold text-gray-900">
                  {billingCycle === "monthly" ? "$89" : "$79"}
                  <span className="text-lg font-normal text-gray-500">/mo</span>
                </p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <i className="fas fa-check text-blue-600 mr-3"></i>
                  <span className="text-gray-600">All Basic features</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-blue-600 mr-3"></i>
                  <span className="text-gray-600">Group fitness classes</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-blue-600 mr-3"></i>
                  <span className="text-gray-600">Personal trainer session</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-blue-600 mr-3"></i>
                  <span className="text-gray-600">24/7 gym access</span>
                </li>
              </ul>
              <button className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700">
                Select Plan
              </button>
            </div>

            {/* Elite Plan */}
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Elite</h3>
                  <p className="text-gray-500">Monthly membership</p>
                </div>
              </div>
              <div className="mb-6">
                <p className="text-4xl font-bold text-gray-900">
                  {billingCycle === "monthly" ? "$129" : "$109"}
                  <span className="text-lg font-normal text-gray-500">/mo</span>
                </p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <i className="fas fa-check text-blue-600 mr-3"></i>
                  <span className="text-gray-600">All Premium features</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-blue-600 mr-3"></i>
                  <span className="text-gray-600">Unlimited guest passes</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-blue-600 mr-3"></i>
                  <span className="text-gray-600">Priority class booking</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-blue-600 mr-3"></i>
                  <span className="text-gray-600">Spa access</span>
                </li>
              </ul>
              <button className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700">
                Select Plan
              </button>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <button
                  className="flex justify-between items-center w-full text-left"
                  onClick={() => handleFaqToggle(0)}
                >
                  <span className="text-lg font-medium text-gray-900">What's included in the trial period?</span>
                  <i className={`fas fa-chevron-down text-gray-400 transition-transform ${openFaq === 0 ? "rotate-180" : ""}`}></i>
                </button>
                {openFaq === 0 && (
                  <div className="mt-3">
                    <p className="text-gray-600">
                      Our trial includes full access to gym facilities, basic equipment, and one complimentary group fitness class. Personal training sessions are available at additional cost.
                    </p>
                  </div>
                )}
              </div>
              <div className="border-b border-gray-200 pb-6">
                <button
                  className="flex justify-between items-center w-full text-left"
                  onClick={() => handleFaqToggle(1)}
                >
                  <span className="text-lg font-medium text-gray-900">Can I freeze my membership?</span>
                  <i className={`fas fa-chevron-down text-gray-400 transition-transform ${openFaq === 1 ? "rotate-180" : ""}`}></i>
                </button>
                {openFaq === 1 && (
                  <div className="mt-3">
                    <p className="text-gray-600">Yes, you can freeze your membership for up to 3 months per year with prior notice.</p>
                  </div>
                )}
              </div>
              <div className="border-b border-gray-200 pb-6">
                <button
                  className="flex justify-between items-center w-full text-left"
                  onClick={() => handleFaqToggle(2)}
                >
                  <span className="text-lg font-medium text-gray-900">What's your cancellation policy?</span>
                  <i className={`fas fa-chevron-down text-gray-400 transition-transform ${openFaq === 2 ? "rotate-180" : ""}`}></i>
                </button>
                {openFaq === 2 && (
                  <div className="mt-3">
                    <p className="text-gray-600">You can cancel anytime with a 30-day notice. No long-term commitments required.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MembershipPage;