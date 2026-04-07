import { createTeam, updateTeam, deleteTeam, getAllTeams, getTeamById } from "../team.service";
import { createUser } from "../../auth/auth.repository";
import prisma from "../../lib/prisma";
import { describe, it, expect, beforeEach, beforeAll } from "@jest/globals";
import bcrypt from "bcryptjs";

describe("Team Service", () => {
    let user1: any;
    let user2: any;
    let user3: any;

    beforeEach(async () => {
        await prisma.comment.deleteMany();
        await prisma.issue.deleteMany();
        await prisma.team.deleteMany();
        await prisma.user.deleteMany();

        user1 = await createUser(
          "user1",
          "user1@example.com",
          "password123"
        );
        user2 = await createUser(
          "user2",
          "user2@example.com",
          "password123"
        );
        user3 = await createUser(
          "user3",
          "user3@example.com",
          "password123"
        );
    });
    
    describe("createTeam", () => {
        it("should create a team with members", async () => {
          const team = await createTeam("Team A", [user1.id, user2.id, user3.id]);
          expect(team).toHaveProperty("id");
          expect(team.name).toBe("Team A");
        });
    });

    describe("getTeamById", () => {
        it("should return a team by id", async () => {
          const team = await createTeam("Team B", [user1.id, user2.id]);
          const foundTeam = await getTeamById(team.id);
          expect(foundTeam).toHaveProperty("id", team.id);
          expect(foundTeam.name).toBe("Team B");
        });
    });

    describe("getAllTeams", () => {
        it("should return all teams", async () => {
          await createTeam("Team C", [user1.id]);
          await createTeam("Team D", [user2.id]);
          const teams = await getAllTeams();
          expect(teams.length).toBe(2);
        });
    });

    describe("updateTeam", () => {
        it("should update a team's name and members", async () => {
          const team = await createTeam("Team E", [user1.id]);
          const updatedTeam = await updateTeam(team.id, "Updated Team E", [user2.id, user3.id]);
          expect(updatedTeam.name).toBe("Updated Team E");
        });
    });

    describe("deleteTeam", () => {
        it("should delete a team by id", async () => {
          const team = await createTeam("Team F", [user1.id]);
          await deleteTeam(team.id);
          await expect(getTeamById(team.id)).rejects.toThrow("Team not found");
        });
    });
});