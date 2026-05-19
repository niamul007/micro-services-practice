import { Request, Response } from "express";
import prisma from "../config/prisma";

export const createJob = async (req: Request, res: Response) => {
  // extract job details from request body and user ID from auth middleware
  const { title, description, location, type } = req?.body;
  const userId = (req as any).user?.id;
  // double check even though middleware verified — controllers shouldn't trust upstream blindly
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  // create new job record in database with associated user ID
  const newJob = { title, description, location, type, userId };
  // return the created job in response (in real app, consider stripping sensitive info or using a DTO)
  const job = await (prisma as any).job.create({ data: newJob });
  return res.status(201).json({ message: "Job created successfully", job });
};


export const getJobs = async (req: Request, res: Response) => {
  // fetch all jobs from database — in real app, add pagination and filtering
    const jobs = await (prisma as any).job.findMany();
    return res.status(200).json({ jobs });
}


export const getJobById = async (req: Request, res: Response) => {
  // extract job ID from request params and fetch job from database
    const { id } = req?.params;
    // if job not found, return 404 — in real app, validate ID format and handle errors more robustly
    const job = await (prisma as any).job.findUnique({ where: { id } });
    if(!job){
        return res.status(404).json({ message: "Job not found" });
    }
    return res.status(200).json({ job });
}