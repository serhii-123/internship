CREATE TABLE `url_matches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`original_url` varchar(2048) NOT NULL,
	`short_path` varchar(6) NOT NULL,
	CONSTRAINT `url_matches_id` PRIMARY KEY(`id`),
	CONSTRAINT `id_UNIQUE` UNIQUE(`id`),
	CONSTRAINT `short_path_UNIQUE` UNIQUE(`short_path`)
);
