import axios from 'axios';
import { API_JOBS, API_JOB_BY_ID } from '../../constant';

export async function fetchJobs() {
  const response = await axios.get(API_JOBS);
  return response.data;
}

export async function fetchJobById(jobId) {
  const response = await axios.get(API_JOB_BY_ID(jobId));
  return response.data;
}

export async function addJob(jobData) {
  const response = await axios.post(API_JOBS, jobData);
  return response.data;
}

export async function updateJob(jobId, jobData) {
  const response = await axios.put(API_JOB_BY_ID(jobId), jobData);
  return response.data;
}

export async function deleteJob(jobId) {
  const response = await axios.delete(API_JOB_BY_ID(jobId));
  return response.data;
}
