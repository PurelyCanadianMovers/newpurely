CREATE TABLE `blog_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(255) NOT NULL,
	`idea` text,
	`title` text NOT NULL,
	`metaDescription` text,
	`content` text NOT NULL,
	`focusKeywords` text,
	`readTimeMinutes` int DEFAULT 5,
	`status` enum('draft','published') NOT NULL DEFAULT 'draft',
	`coverImageUrl` text,
	`authorName` varchar(255) DEFAULT 'Purely Canadian Movers',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`publishedAt` timestamp,
	CONSTRAINT `blog_posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_posts_slug_unique` UNIQUE(`slug`)
);
