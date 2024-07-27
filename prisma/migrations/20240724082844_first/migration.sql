-- CreateTable
CREATE TABLE "Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "body" TEXT NOT NULL,
    "Completed" BOOLEAN NOT NULL,
    "Priority" INTEGER NOT NULL
);
