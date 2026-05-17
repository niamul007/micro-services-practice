import { Request, Response } from "express";
import prisma from "../config/prisma";

export const createJob = async (req: Request, res: Response) => {
  const { title, description, location, type } = req?.body;
  const userId = (req as any).user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const newJob = { title, description, location, type, userId };
  const job = await (prisma as any).job.create({ data: newJob });
  return res.status(201).json({ message: "Job created successfully", job });
};


export const getJobs = async (req: Request, res: Response) => {
    const jobs = await (prisma as any).job.findMany();
    return res.status(200).json({ jobs });
}


export const getJobById = async (req: Request, res: Response) => {
    const { id } = req?.params;
    const job = await (prisma as any).job.findUnique({ where: { id } });
    if(!job){
        return res.status(404).json({ message: "Job not found" });
    }
    return res.status(200).json({ job });
}