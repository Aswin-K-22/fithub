// src/features/user/pages/MembershipPage.tsx
import React, { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

import { toast } from "react-toastify";
import { getMembershipPlansUser } from "../../../lib/api/authApi";

interface MembershipPlan {
  id: string;
  name: "Premium" | "Basic" | "Diamond";
  description: string;
  price: number;
  duration: number;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

const MembershipPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPlans, setTotalPlans] = useState(0);
  const plansPerPage = 3; // Matches backend limit

  // FAQ toggle state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleFaqToggle = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Fetch plans from backend
  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      try {
        const { plans: fetchedPlans, total } = await getMembershipPlansUser(currentPage, plansPerPage);
        setPlans(fetchedPlans);
        setTotalPlans(total);
      } catch (error) {
        console.log(error);
        
        toast.error("Failed to load membership plans");
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [currentPage]);

  // Calculate price based on billing cycle
  const getDisplayPrice = (plan: MembershipPlan) => {
    const monthlyPrice = plan.price / plan.duration;
    return billingCycle === "monthly" ? monthlyPrice : monthlyPrice * 12 * 0.9; // 10% discount for annual
  };

  // Pagination controls
  const totalPages = Math.ceil(totalPlans / plansPerPage);
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Feature label mapping
  const featureLabels: { [key: string]: string } = {
    "24/7-access": "24/7 Gym Access",
    "personal-trainer": "Personal Trainer Session",
    "group-classes": "Group Fitness Classes",
    "spa-access": "Spa Access",
  };

  return (
    <div className="bg-gray-50 font-inter min-h-screen">
      <Navbar />
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
          {loading ? (
            <div className="text-center text-gray-600">Loading plans...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`bg-white rounded-xl shadow-sm p-8 border ${
                    plan.name === "Premium" ? "border-2 border-blue-600" : "border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                      <p className="text-gray-500">{plan.duration}-month membership</p>
                    </div>
                    {plan.name === "Basic" && (
                      <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                        Popular
                      </span>
                    )}
                    {plan.name === "Premium" && (
                      <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                        Best Value
                      </span>
                    )}
                  </div>
                  <div className="mb-6">
                    <p className="text-4xl font-bold text-gray-900">
                      ${getDisplayPrice(plan).toFixed(2)}
                      <span className="text-lg font-normal text-gray-500">/mo</span>
                    </p>
                    {billingCycle === "annual" && (
                      <p className="text-sm text-gray-500">Billed annually (${(getDisplayPrice(plan) * 12).toFixed(2)})</p>
                    )}
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <i className="fas fa-check text-blue-600 mr-3"></i>
                        <span className="text-gray-600">{featureLabels[feature] || feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700">
                    Select Plan
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mb-16">
              <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-200"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === page ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-200"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </nav>
            </div>
          )}

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
                  <i
                    className={`fas fa-chevron-down text-gray-400 transition-transform ${
                      openFaq === 0 ? "rotate-180" : ""
                    }`}
                  ></i>
                </button>
                {openFaq === 0 && (
                  <div className="mt-3">
                    <p className="text-gray-600">
                      Our trial includes full access to gym facilities, basic equipment, and one complimentary group fitness class. Personal training sessions are available at an additional cost.
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
                  <i
                    className={`fas fa-chevron-down text-gray-400 transition-transform ${
                      openFaq === 1 ? "rotate-180" : ""
                    }`}
                  ></i>
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
                  <i
                    className={`fas fa-chevron-down text-gray-400 transition-transform ${
                      openFaq === 2 ? "rotate-180" : ""
                    }`}
                  ></i>
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
      <Footer />
    </div>
  );
};

export default MembershipPage;