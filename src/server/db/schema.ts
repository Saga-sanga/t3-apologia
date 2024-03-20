import type { AdapterAccount } from "@auth/core/adapters";
import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  json,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { v4 as uuidv4 } from "uuid";

export const roleEnum = pgEnum("role", ["user", "writer", "admin"]);
export const stateEnum = pgEnum("state", ["draft", "published"]);
export const questionStatusEnum = pgEnum("questionStatus", [
  "unanswered",
  "answered",
  "duplicate",
]);

export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  username: text("username"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  completedOnboarding: boolean("completedOnboarding").default(false),
  image: text("image"),
  role: roleEnum("role").default("user").notNull(),
});

export const follows = pgTable("follow", {
  followerId: text("followerId").references(() => users.id),
  followingId: text("followigId").references(() => users.id),
});

export const zawhna = pgTable("zawhna", {
  id: text("id")
    .$default(() => uuidv4())
    .primaryKey(),
  answerId: text("answerId").references((): AnyPgColumn => posts.id, {
    onDelete: "set null",
  }),
  content: text("content"),
  userId: text("userId").references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").defaultNow(),
  public: boolean("public").default(false),
  status: questionStatusEnum("status").default("unanswered").notNull(),
});

export const zawhnaRelations = relations(zawhna, ({ one }) => ({
  users: one(users, {
    fields: [zawhna.userId],
    references: [users.id],
  }),
}));

export const posts = pgTable("post", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  slug: text("slug").unique(),
  authorId: text("authorId").references(() => users.id),
  hideAuthor: boolean("hideAuthor").default(true).notNull(),
  categoryId: text("categoryId").references(() => categories.id, {
    onDelete: "set null",
  }),
  title: text("title"),
  description: text("description"),
  state: stateEnum("state").default("draft").notNull(),
  questionId: text("questionId").references(() => zawhna.id, {
    onDelete: "set null",
  }),
  content: json("content"),
  image: text("image"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const postRelations = relations(posts, ({ one }) => ({
  category: one(categories, {
    fields: [posts.categoryId],
    references: [categories.id],
  }),
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  zawhna: one(zawhna, {
    fields: [posts.questionId],
    references: [zawhna.id],
  }),
}));

export const categories = pgTable("category", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  name: text("name"),
});

// export const postCategories = pgTable("postCategory", {
//   postId: text("postId").references(() => posts.id),
//   categoryId: text("categoryId").references(() => categories.id),
// });

export const comments = pgTable("comment", {
  id: text("id")
    .$defaultFn(() => uuidv4())
    .primaryKey(),
  parentCommentId: text("parentCommentId").references(
    (): AnyPgColumn => comments.id,
    { onDelete: "cascade" },
  ),
  userId: text("userId").references(() => users.id),
  content: text("content"),
  postId: text("postId").references(() => posts.id),
  zawhnaId: text("zawhnaId").references(() => zawhna.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const likes = pgTable("like", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  userId: text("userId").references(() => users.id, { onDelete: "cascade" }),
  postId: text("postId").references(() => posts.id),
  zawhnaId: text("zawhnaId").references(() => zawhna.id),
  commentId: text("commentId").references(() => comments.id),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token_expires_in: integer("refresh_token_expires_in"),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export type SelectUser = typeof users.$inferSelect;
export type SelectZawhna = typeof zawhna.$inferSelect;
export type SelectPost = typeof posts.$inferSelect;
export type SelectCategory = typeof categories.$inferSelect;
