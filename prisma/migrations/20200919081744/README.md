# Migration `20200919081744`

This migration has been generated by kimjeongwonn at 9/19/2020, 8:17:44 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_userId_fkey"

ALTER TABLE "public"."Message" DROP COLUMN "userId"
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200919081511..20200919081744
--- datamodel.dml
+++ datamodel.dml
@@ -2,9 +2,9 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 generator client {
   provider = "prisma-client-js"
@@ -26,9 +26,8 @@
   comments       Comment[]
   participatings Room[]    @relation(references: [id])
   messages       Message[]
   signUpAt       DateTime  @default(now())
-  Message        Message[] @relation("SendRelation")
 }
 model Post {
   id       Int       @default(autoincrement()) @id
@@ -67,12 +66,10 @@
 model Message {
   id         Int      @default(autoincrement()) @id
   text       String
-  fromUser   User     @relation(name: "SendRelation", fields: [fromUserId], references: [id])
+  fromUser   User     @relation(fields: [fromUserId], references: [id])
   fromUserId String
   room       Room     @relation(fields: [roomId], references: [id])
   roomId     Int
   timeStamp  DateTime @default(now())
-  User       User?    @relation(fields: [userId], references: [id])
-  userId     String?
 }
```

