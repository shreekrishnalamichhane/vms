-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Vaccine" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "numberOfDoses" INTEGER,
    "manufacturer" TEXT,
    "developedYear" INTEGER,
    "ageGroup" TEXT,
    "sideEffects" TEXT,
    "userId" INTEGER,
    "mandatory" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Vaccine_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Vaccine" ("ageGroup", "createdAt", "description", "developedYear", "id", "image", "manufacturer", "name", "numberOfDoses", "sideEffects", "updatedAt", "userId") SELECT "ageGroup", "createdAt", "description", "developedYear", "id", "image", "manufacturer", "name", "numberOfDoses", "sideEffects", "updatedAt", "userId" FROM "Vaccine";
DROP TABLE "Vaccine";
ALTER TABLE "new_Vaccine" RENAME TO "Vaccine";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
