CREATE TABLE `configs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `configs_key_unique` ON `configs` (`key`);--> statement-breakpoint
CREATE TABLE `inscriptions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nome` text NOT NULL,
	`telefone` text NOT NULL,
	`tamanho` text NOT NULL,
	`cor_camisa` text DEFAULT 'Azul' NOT NULL,
	`trabalha_bandeiras` integer DEFAULT false NOT NULL,
	`empresa_bandeiras` text,
	`presenca_spinning` integer DEFAULT false NOT NULL,
	`pagamento_confirmado` integer DEFAULT false NOT NULL,
	`data_inscricao` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);