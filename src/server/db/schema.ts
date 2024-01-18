import type { AdapterAccount } from "@auth/core/adapters";
import { relations } from "drizzle-orm";
import {
  type AnyPgColumn,
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  json,
} from "drizzle-orm/pg-core";
import { v4 as uuidv4 } from "uuid";

export const roleEnum = pgEnum("role", ["user, writer, admin"]);
export const stateEnum = pgEnum("state", ["draft, published"]);

export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  username: text("username"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  role: roleEnum("role"),
});

export const follows = pgTable("follows", {
  followerId: text("followerId").references(() => users.id),
  followingId: text("followigId").references(() => users.id),
});

export const questions = pgTable("questions", {
  id: text("id")
    .$defaultFn(() => uuidv4())
    .primaryKey(),
  answerId: text("answerId").unique(),
  userId: text("id").references(() => users.id, { onDelete: "cascade" }),
  content: text("content"),
  createdAt: timestamp("createdAt").defaultNow(),
  public: boolean("public").default(false),
});

export const questionsRelations = relations(questions, ({ one }) => ({
  answer: one(posts, {
    fields: [questions.answerId],
    references: [posts.id],
  }),
}));

export const posts = pgTable("posts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  slug: text("slug").unique(),
  questionId: text("questionId").references(() => questions.id),
  userId: text("userId").references(() => users.id),
  title: text("title"),
  state: stateEnum("state"),
  content: json("content"),
  image: text("image"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const categories = pgTable("categories", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  name: text("name"),
});

export const postCategories = pgTable("postCategories", {
  postId: text("postId").references(() => posts.id),
  categoryId: text("categoryId").references(() => categories.id),
});

export const comments = pgTable("comments", {
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
  questionId: text("questionId").references(() => questions.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const likes = pgTable("likes", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  userId: text("userId").references(() => users.id, { onDelete: "cascade" }),
  postId: text("postId").references(() => posts.id),
  questionId: text("questionId").references(() => questions.id),
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
