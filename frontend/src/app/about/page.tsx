import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { ArrowRight, CheckCircle, Target, Zap, Users, TrendingUp } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Mission-Driven",
      description: "Connecting talent with opportunity through innovation"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community First",
      description: "Building a supportive ecosystem for job seekers and employers"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Fast & Efficient",
      description: "Streamlined processes for quick job matching"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Growth Focused",
      description: "Empowering careers and business expansion"
    },
  ];

  const stats = [
    { number: "10k+", label: "Active Jobs", icon: "🏢" },
    { number: "5k+", label: "Companies", icon: "🌍" },
    { number: "50k+", label: "Job Seekers", icon: "👥" },
    { number: "95%", label: "Success Rate", icon: "⭐" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/30">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto">
          {/* Image with premium styling */}
          <div className="flex justify-center mb-12">
            <div className="relative group max-w-[500px] w-full">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-blue-200/50 dark:border-blue-900/30">
                <img
                  src="/about.jpg"
                  className="w-full h-96 object-cover transform transition-transform duration-500 group-hover:scale-105"
                  alt="About NexHire"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="text-center space-y-8">
            <div className="inline-block">
              <span className="px-4 py-2 rounded-full border border-blue-300 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-300 text-sm font-semibold">
                About NexHire
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Our Mission: Connecting<br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Talent with Opportunity
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed opacity-80 max-w-3xl mx-auto">
              At NexHire, we're revolutionizing the job search experience. Our mission is to create meaningful connections between talented individuals and forward-thinking companies, fostering growth and success for both.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center group">
                <div className="text-5xl font-bold mb-3 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stat.number}
                </p>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Our <span className="text-blue-600">Core Values</span>
            </h2>
            <p className="text-xl opacity-70">
              Guiding principles that shape everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, idx) => (
              <div
                key={idx}
                className="group p-8 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-md hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300"
              >
                <div className="text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
                  {value.title}
                </h3>
                <p className="opacity-70 text-lg leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">
              Why Choose NexHire?
            </h2>

            <div className="space-y-6">
              {[
                "🚀 AI-powered job matching for better compatibility",
                "🔒 Secure platform with verified employers",
                "💡 Advanced tools for profile and resume optimization",
                "⚡ Fast, seamless experience for job seekers and recruiters",
                "🌟 Transparent and fair for all users",
              ].map((point, idx) => (
                <div key={idx} className="flex items-center gap-4 text-lg">
                  <CheckCircle className="w-6 h-6 flex-shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8 bg-white dark:bg-slate-800 rounded-3xl p-12 shadow-lg border border-gray-200 dark:border-slate-700">
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Transform Your <span className="text-blue-600">Career?</span>
            </h2>
            <p className="text-xl opacity-80">
              Join thousands of successful job seekers who found their dream jobs on NexHire
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Link href="/jobs">
                <Button size="lg" className="gap-2 h-13 px-8 text-base font-semibold">
                  Explore Jobs
                  <ArrowRight size={20} />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="gap-2 h-13 px-8 text-base font-semibold">
                  Get Started
                  <ArrowRight size={20} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
