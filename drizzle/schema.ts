import { pgTable, pgEnum, text, timestamp, foreignKey, unique, boolean, primaryKey, integer } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const role = pgEnum("role", ['user, writer, admin'])
export const state = pgEnum("state", ['draft, published'])


export const user = pgTable("user", {
	id: text("id").primaryKey().notNull(),
	name: text("name"),
	username: text("username"),
	email: text("email").notNull(),
	emailVerified: timestamp("emailVerified", { mode: 'string' }),
	image: text("image"),
	role: role("role"),
});

export const comments = pgTable("comments", {
	id: text("id").primaryKey().notNull(),
	parentCommentId: text("parentCommentId"),
	userId: text("userId").references(() => user.id),
	content: text("content"),
	postId: text("postId").references(() => posts.id),
	questionId: text("questionId").references(() => questions.id, { onDelete: "cascade" } ),
	createdAt: timestamp("createdAt", { mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		commentsParentCommentIdCommentsIdFk: foreignKey({
			columns: [table.parentCommentId],
			foreignColumns: [table.id],
			name: "comments_parentCommentId_comments_id_fk"
		}).onDelete("cascade"),
	}
});

export const posts = pgTable("posts", {
	id: text("id").primaryKey().notNull(),
	slug: text("slug"),
	questionId: text("questionId").references(() => questions.id),
	userId: text("userId").references(() => user.id),
	title: text("title"),
	content: text("content"),
	state: state("state"),
	image: text("image"),
	createdAt: timestamp("createdAt", { mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		postsSlugUnique: unique("posts_slug_unique").on(table.slug),
	}
});

export const questions = pgTable("questions", {
	id: text("id").primaryKey().notNull().references(() => user.id, { onDelete: "cascade" } ),
	answerId: text("answerId"),
	content: text("content"),
	createdAt: timestamp("createdAt", { mode: 'string' }).defaultNow(),
	public: boolean("public").default(false),
},
(table) => {
	return {
		questionsAnswerIdUnique: unique("questions_answerId_unique").on(table.answerId),
	}
});

export const follows = pgTable("follows", {
	followerId: text("followerId").references(() => user.id),
	followigId: text("followigId").references(() => user.id),
});

export const likes = pgTable("likes", {
	id: text("id").primaryKey().notNull(),
	userId: text("userId").references(() => user.id, { onDelete: "cascade" } ),
	postId: text("postId").references(() => posts.id),
	questionId: text("questionId").references(() => questions.id),
	commentId: text("commentId").references(() => comments.id),
});

export const postCategories = pgTable("postCategories", {
	postId: text("postId").references(() => posts.id),
	categoryId: text("categoryId").references(() => categories.id),
});

export const categories = pgTable("categories", {
	id: text("id").primaryKey().notNull(),
	name: text("name"),
});

export const session = pgTable("session", {
	sessionToken: text("sessionToken").primaryKey().notNull(),
	userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" } ),
	expires: timestamp("expires", { mode: 'string' }).notNull(),
});

export const verificationToken = pgTable("verificationToken", {
	identifier: text("identifier").notNull(),
	token: text("token").notNull(),
	expires: timestamp("expires", { mode: 'string' }).notNull(),
},
(table) => {
	return {
		verificationTokenIdentifierTokenPk: primaryKey({ columns: [table.identifier, table.token], name: "verificationToken_identifier_token_pk"})
	}
});

export const account = pgTable("account", {
	userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" } ),
	type: text("type").notNull(),
	provider: text("provider").notNull(),
	providerAccountId: text("providerAccountId").notNull(),
	refreshTokenExpiresIn: integer("refresh_token_expires_in"),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text("scope"),
	idToken: text("id_token"),
	sessionState: text("session_state"),
},
(table) => {
	return {
		accountProviderProviderAccountIdPk: primaryKey({ columns: [table.provider, table.providerAccountId], name: "account_provider_providerAccountId_pk"})
	}
});