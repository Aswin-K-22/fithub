import React from "react";
import Slider from "react-slick";

const Testimonials: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const testimonials = [
    {
      name: "Sarah Johnson",
      img: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      text: "FitHub's AI trainer has completely transformed my workout routine. The personalized plans and progress tracking keep me motivated!",
    },
    {
      name: "Michael Chen",
      img: "https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      text: "The flexibility to work out at any partner gym is amazing. I travel a lot for work, and FitHub makes it easy to stay consistent with my fitness routine.",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            What Our Members Say
          </h2>
        </div>
        <div className="mt-12">
          <Slider {...settings}>
            {testimonials.map((t, index) => (
              <div key={index} className="p-4">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="flex items-center">
                    <img className="h-12 w-12 rounded-full" src={t.img} alt={t.name} />
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold">{t.name}</h4>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className="fas fa-star"></i>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-600">"{t.text}"</p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;