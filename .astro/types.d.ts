declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	export { z } from 'astro/zod';

	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	// This needs to be in sync with ImageMetadata
	export type ImageFunction = () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>,
				import('astro/zod').ZodLiteral<'avif'>,
			]
		>;
	}>;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<[BaseSchemaWithoutEffects, ...BaseSchemaWithoutEffects[]]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<BaseSchemaWithoutEffects, BaseSchemaWithoutEffects>;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	export type SchemaContext = { image: ImageFunction };

	type DataCollectionConfig<S extends BaseSchema> = {
		type: 'data';
		schema?: S | ((context: SchemaContext) => S);
	};

	type ContentCollectionConfig<S extends BaseSchema> = {
		type?: 'content';
		schema?: S | ((context: SchemaContext) => S);
	};

	type CollectionConfig<S> = ContentCollectionConfig<S> | DataCollectionConfig<S>;

	export function defineCollection<S extends BaseSchema>(
		input: CollectionConfig<S>
	): CollectionConfig<S>;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
			  }
			: {
					collection: C;
					id: keyof DataEntryMap[C];
			  }
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"docs": {
"404.md": {
	id: "404.md";
  slug: "404";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"chapter0/community.mdx": {
	id: "chapter0/community.mdx";
  slug: "chapter0/community";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter0/get_ready.mdx": {
	id: "chapter0/get_ready.mdx";
  slug: "chapter0/get_ready";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter0/introduction.mdx": {
	id: "chapter0/introduction.mdx";
  slug: "chapter0/introduction";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter1/audio_data.mdx": {
	id: "chapter1/audio_data.mdx";
  slug: "chapter1/audio_data";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter1/introduction.mdx": {
	id: "chapter1/introduction.mdx";
  slug: "chapter1/introduction";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter1/load_and_explore.mdx": {
	id: "chapter1/load_and_explore.mdx";
  slug: "chapter1/load_and_explore";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter1/preprocessing.mdx": {
	id: "chapter1/preprocessing.mdx";
  slug: "chapter1/preprocessing";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter1/quiz.mdx": {
	id: "chapter1/quiz.mdx";
  slug: "chapter1/quiz";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter1/streaming.mdx": {
	id: "chapter1/streaming.mdx";
  slug: "chapter1/streaming";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter1/supplemental_reading.mdx": {
	id: "chapter1/supplemental_reading.mdx";
  slug: "chapter1/supplemental_reading";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter2/asr_pipeline.mdx": {
	id: "chapter2/asr_pipeline.mdx";
  slug: "chapter2/asr_pipeline";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter2/audio_classification_pipeline.mdx": {
	id: "chapter2/audio_classification_pipeline.mdx";
  slug: "chapter2/audio_classification_pipeline";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter2/hands_on.mdx": {
	id: "chapter2/hands_on.mdx";
  slug: "chapter2/hands_on";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter2/introduction.mdx": {
	id: "chapter2/introduction.mdx";
  slug: "chapter2/introduction";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter2/tts_pipeline.mdx": {
	id: "chapter2/tts_pipeline.mdx";
  slug: "chapter2/tts_pipeline";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter3/classification.mdx": {
	id: "chapter3/classification.mdx";
  slug: "chapter3/classification";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter3/ctc.mdx": {
	id: "chapter3/ctc.mdx";
  slug: "chapter3/ctc";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter3/introduction.mdx": {
	id: "chapter3/introduction.mdx";
  slug: "chapter3/introduction";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter3/quiz.mdx": {
	id: "chapter3/quiz.mdx";
  slug: "chapter3/quiz";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter3/seq2seq.mdx": {
	id: "chapter3/seq2seq.mdx";
  slug: "chapter3/seq2seq";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter3/supplemental_reading.mdx": {
	id: "chapter3/supplemental_reading.mdx";
  slug: "chapter3/supplemental_reading";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter4/classification_models.mdx": {
	id: "chapter4/classification_models.mdx";
  slug: "chapter4/classification_models";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter4/demo.mdx": {
	id: "chapter4/demo.mdx";
  slug: "chapter4/demo";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter4/fine-tuning.mdx": {
	id: "chapter4/fine-tuning.mdx";
  slug: "chapter4/fine-tuning";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter4/hands_on.mdx": {
	id: "chapter4/hands_on.mdx";
  slug: "chapter4/hands_on";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter4/introduction.mdx": {
	id: "chapter4/introduction.mdx";
  slug: "chapter4/introduction";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter5/asr_models.mdx": {
	id: "chapter5/asr_models.mdx";
  slug: "chapter5/asr_models";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter5/choosing_dataset.mdx": {
	id: "chapter5/choosing_dataset.mdx";
  slug: "chapter5/choosing_dataset";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter5/demo.mdx": {
	id: "chapter5/demo.mdx";
  slug: "chapter5/demo";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter5/evaluation.mdx": {
	id: "chapter5/evaluation.mdx";
  slug: "chapter5/evaluation";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter5/fine-tuning.mdx": {
	id: "chapter5/fine-tuning.mdx";
  slug: "chapter5/fine-tuning";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter5/hands_on.mdx": {
	id: "chapter5/hands_on.mdx";
  slug: "chapter5/hands_on";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter5/introduction.mdx": {
	id: "chapter5/introduction.mdx";
  slug: "chapter5/introduction";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter5/supplemental_reading.mdx": {
	id: "chapter5/supplemental_reading.mdx";
  slug: "chapter5/supplemental_reading";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter6/evaluation.mdx": {
	id: "chapter6/evaluation.mdx";
  slug: "chapter6/evaluation";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter6/fine-tuning.mdx": {
	id: "chapter6/fine-tuning.mdx";
  slug: "chapter6/fine-tuning";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter6/hands_on.mdx": {
	id: "chapter6/hands_on.mdx";
  slug: "chapter6/hands_on";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter6/introduction.mdx": {
	id: "chapter6/introduction.mdx";
  slug: "chapter6/introduction";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter6/pre-trained_models.mdx": {
	id: "chapter6/pre-trained_models.mdx";
  slug: "chapter6/pre-trained_models";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter6/supplemental_reading.mdx": {
	id: "chapter6/supplemental_reading.mdx";
  slug: "chapter6/supplemental_reading";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter6/tts_datasets.mdx": {
	id: "chapter6/tts_datasets.mdx";
  slug: "chapter6/tts_datasets";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter7/hands_on.mdx": {
	id: "chapter7/hands_on.mdx";
  slug: "chapter7/hands_on";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter7/introduction.mdx": {
	id: "chapter7/introduction.mdx";
  slug: "chapter7/introduction";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter7/speech-to-speech.mdx": {
	id: "chapter7/speech-to-speech.mdx";
  slug: "chapter7/speech-to-speech";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter7/supplemental_reading.mdx": {
	id: "chapter7/supplemental_reading.mdx";
  slug: "chapter7/supplemental_reading";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter7/transcribe-meeting.mdx": {
	id: "chapter7/transcribe-meeting.mdx";
  slug: "chapter7/transcribe-meeting";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter7/voice-assistant.mdx": {
	id: "chapter7/voice-assistant.mdx";
  slug: "chapter7/voice-assistant";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter8/certification.mdx": {
	id: "chapter8/certification.mdx";
  slug: "chapter8/certification";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"chapter8/introduction.mdx": {
	id: "chapter8/introduction.mdx";
  slug: "chapter8/introduction";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"index.mdx": {
	id: "index.mdx";
  slug: "index";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	type ContentConfig = typeof import("../src/content/config");
}
