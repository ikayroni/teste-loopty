import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTasksTable1705710000001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create ENUMs
        await queryRunner.query(`
            CREATE TYPE "tasks_status_enum" AS ENUM ('pending', 'in_progress', 'completed')
        `);

        await queryRunner.query(`
            CREATE TYPE "tasks_priority_enum" AS ENUM ('low', 'medium', 'high')
        `);

        // Create tasks table
        await queryRunner.query(`
            CREATE TABLE "tasks" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" varchar NOT NULL,
                "description" text,
                "status" "tasks_status_enum" NOT NULL DEFAULT 'pending',
                "priority" "tasks_priority_enum" NOT NULL DEFAULT 'medium',
                "due_date" timestamp(6),
                "created_at" timestamp(6) NOT NULL DEFAULT now(),
                "updated_at" timestamp(6) NOT NULL DEFAULT now(),
                "user_id" uuid NOT NULL,
                CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"),
                CONSTRAINT "FK_db55af84c226af9dce09487b61b" FOREIGN KEY ("user_id") 
                    REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
            )
        `);

        // Create index on user_id for better performance
        await queryRunner.query(`
            CREATE INDEX "IDX_db55af84c226af9dce09487b61" ON "tasks" ("user_id")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`DROP TYPE "tasks_priority_enum"`);
        await queryRunner.query(`DROP TYPE "tasks_status_enum"`);
    }
}
