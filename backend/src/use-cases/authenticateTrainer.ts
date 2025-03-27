import { Trainer } from "../entities/trainer";
import { TrainerRepository } from "../adapters/trainerRepository";
import * as bcrypt from "bcrypt";
import { log } from "console";

export class AuthenticateTrainer {
  constructor(private trainerRepo: TrainerRepository) {}

  async execute(email: string, password: string): Promise<{ trainer: Trainer }> {
    const trainer = await this.trainerRepo.findByEmail(email);
    console.log('email -' , email , 'password' ,password , );
    
    if (!trainer || !(await bcrypt.compare(password, trainer.password))) {
      throw new Error("Invalid email or password");
    }
    if (trainer.role !== "trainer") {
      throw new Error("Not authorized as admin");
    }
    return { trainer };
  }
}