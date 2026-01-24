"use client";

import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { job_service, utils_service, useAppData } from "@/context/AppContext";
import { Application, Job, JobCompatibility } from "@/type";
import axios from "axios";
import {
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  DollarSign,
  MapPin,
  Users,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import Link from "next/link";

const JobPage = () => {
  const { id } = useParams();
  const { user, isAuth, applyJob, applications, btnLoading } = useAppData();
  const router = useRouter();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  const [compatibility, setCompatibility] = useState<JobCompatibility | null>(null);
  const [compatibilityLoading, setCompatibilityLoading] = useState(false);

  const [applied, setApplied] = useState(false);

  const [jobApplications, setJobApplications] = useState<Application[]>([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [value, setValue] = useState("");

  const token = Cookies.get("token");

  // Check if user already applied
  useEffect(() => {
    if (applications && id) {
      applications.forEach((item: any) => {
        if (item.job_id.toString() === id) setApplied(true);
      });
    }
  }, [applications, id]);

  const applyJobHandler = (id: number) => {
    applyJob(id);
  };

  // Fetch Job
  async function fetchSingleJob() {
    try {
      const { data } = await axios.get(`${job_service}/api/job/${id}`);
      setJob(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  // Fetch applications if recruiter
  const fetchJobApplications = async () => {
    if (!job || !user || user.user_id !== job.posted_by_recuriter_id) return;
    try {
      const { data } = await axios.get(`${job_service}/api/job/application/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobApplications(data);
    } catch (error) {
      console.log(error);
    }
  };

  // AI Compatibility
  const checkCompatibility = async () => {
    if (!job || !user || !job.skills || !user.skills || user.skills.length === 0) return;

    setCompatibilityLoading(true);
    try {
      const { data } = await axios.post(`${utils_service}/api/utils/job-compatibility`, {
        jobSkills: job.skills,
        userSkills: user.skills,
      });
      setCompatibility(data);
    } catch (error: any) {
      console.log(error);
      toast.error("Failed to check compatibility");
    } finally {
      setCompatibilityLoading(false);
    }
  };

  useEffect(() => {
    fetchSingleJob();
  }, [id]);

  useEffect(() => {
    if (job && user) {
      if (user.skills && user.skills.length > 0) {
        checkCompatibility();
      }
      fetchJobApplications();
    }
  }, [job, user]);

  // Filter applications
  const filteredApplications =
    filterStatus === "All"
      ? jobApplications
      : jobApplications.filter((app) => app.status === filterStatus);

  const updateApplicationHandler = async (id: number) => {
    if (value === "") return toast.error("Please give valid value");

    try {
      const { data } = await axios.put(
        `${job_service}/api/job/application/update/${id}`,
        { status: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(data.message);
      fetchJobApplications();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update");
    }
  };

  if (loading) return <Loading />;
  if (!job) return <p className="text-center py-16">Job not found</p>;

  return (
    <div className="min-h-screen bg-secondary/30 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <Button variant="ghost" className="mb-6 gap-2" onClick={() => router.back()}>
          <ArrowRight size={18} /> Back to jobs
        </Button>

        <Card className="overflow-hidden shadow-lg border-2 mb-6">
          <div className="bg-blue-600 p-8 border-b text-white">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                      job.is_active
                        ? "bg-green-100 dark:bg-green-900/30 text-green-600"
                        : "bg-red-100 dark:bg-red-900/30 text-red-600"
                    }`}
                  >
                    {job.is_active ? "Open" : "Closed"}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{job.title}</h1>
                <div className="flex items-center gap-2 text-base opacity-70 mb-2">
                  <Building2 size={18} /> Company Name
                </div>
              </div>

              {user && user.role === "jobseeker" && (
                <div className="shrink-0">
                  {applied ? (
                    <div className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-100 dark:bg-gray-900/30 text-green-600 font-medium">
                      <CheckCircle2 size={20} />
                      Already Applied
                    </div>
                  ) : (
                    job.is_active && (
                      <Button
                        onClick={() => applyJobHandler(job.job_id)}
                        disabled={btnLoading}
                        className="gap-2 h-12 px-8"
                      >
                        <Briefcase size={18} />
                        {btnLoading ? "Applying..." : "Easy Apply"}
                      </Button>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Job Details */}
          <div className="p-8 space-y-6">
            {/* Info Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="flex items-center gap-3 p-4 rounded-lg border bg-background">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                  <MapPin size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs opacity-70 font-medium mb-1">Location</p>
                  <p className="font-semibold">{job.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg border bg-background">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                  <DollarSign size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs opacity-70 font-medium mb-1">Salary</p>
                  <p className="font-semibold">₹{job.salary} P.A</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg border bg-background">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                  <Users size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs opacity-70 font-medium mb-1">Openings</p>
                  <p className="font-semibold">{job.openings} positions</p>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Briefcase size={24} className="text-blue-600" />
                Job Description
              </h2>
              <div className="p-6 rounded-lg bg-secondary border">
                <p className="text-base leading-relaxed whitespace-pre-line">{job.description}</p>
              </div>
            </div>

            {/* Skills */}
            {job.skills?.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Briefcase size={24} className="text-blue-600" /> Required Skills
                </h2>
                <div className="p-6 rounded-lg bg-secondary border flex flex-wrap gap-2">
                  {job.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* AI Compatibility */}
            {user?.skills?.length > 0 && (
              <Card className="overflow-hidden shadow-lg border-2">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Sparkles size={24} className="text-purple-600" /> AI Job Compatibility
                    </h2>
                  </div>

                  {compatibilityLoading && <p className="text-center py-8">Analyzing compatibility...</p>}

                  {compatibility && !compatibilityLoading && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm">
                        <span>Match Score:</span>
                        <span className="font-semibold">{compatibility.compatibilityScore}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-2 rounded-full ${
                            compatibility.compatibilityScore > 75
                              ? "bg-green-500"
                              : compatibility.compatibilityScore > 45
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${compatibility.compatibilityScore}%` }}
                        />
                      </div>
                      {compatibility.matchedSkills?.length > 0 && (
                        <p className="text-sm text-green-700">Matched Skills: {compatibility.matchedSkills.join(", ")}</p>
                      )}
                      {compatibility.missingSkills?.length > 0 && (
                        <p className="text-sm text-red-600">Missing Skills: {compatibility.missingSkills.join(", ")}</p>
                      )}
                      {compatibility.partialMatches?.length > 0 && (
                        <p className="text-sm text-yellow-600">Partial Matches: {compatibility.partialMatches.join(", ")}</p>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Applications for Recruiter */}
            {user && job && user.user_id === job.posted_by_recuriter_id && (
              <div className="w-full mt-8">
                <h2 className="text-2xl font-bold mb-4">Applications</h2>

                <div className="flex items-center gap-2 mb-4">
                  <label htmlFor="filter-status" className="text-sm font-medium">Filter:</label>
                  <select
                    id="filter-status"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="p-2 border-2 border-gray-300 rounded-md bg-background"
                  >
                    <option value="All">All</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Hired">Hired</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                {jobApplications.length > 0 ? (
                  filteredApplications.map((app) => (
                    <Card key={app.application_id} className="mb-4 p-4 border-2">
                      <div className="flex justify-between items-center mb-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            app.status === "Hired"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-600"
                              : app.status === "Rejected"
                              ? "bg-red-100 dark:bg-red-900/30 text-red-600"
                              : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600"
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>

                      <div className="flex gap-3 mb-3">
                        <Link target="_blank" href={app.resume} className="text-blue-500 hover:underline text-sm">
                          View Resume
                        </Link>
                        <Link target="_blank" href={`/account/${app.applicant_id}`} className="text-blue-500 hover:underline text-sm">
                          View Profile
                        </Link>
                      </div>

                      <div className="flex gap-2 pt-3 border-t">
                        <select
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                          className="flex-1 p-2 border-2 border-gray-300 rounded-md bg-background"
                        >
                          <option value="">Update status</option>
                          <option value="Submitted">Submitted</option>
                          <option value="Hired">Hired</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                        <Button disabled={btnLoading} onClick={() => updateApplicationHandler(app.application_id)}>Update</Button>
                      </div>
                    </Card>
                  ))
                ) : (
                  <p className="text-center opacity-70 py-8">No applications yet.</p>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default JobPage;
