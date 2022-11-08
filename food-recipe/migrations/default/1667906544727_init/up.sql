SET check_function_bodies = false;
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';
CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;
CREATE TABLE public."Ingredients" (
    "Ingredient_id" uuid DEFAULT gen_random_uuid() NOT NULL,
    ingredient_name text NOT NULL,
    unit text NOT NULL,
    amount integer NOT NULL,
    food_id uuid NOT NULL
);
CREATE TABLE public.comments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    comment text NOT NULL,
    food_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE public.food (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    category text NOT NULL,
    description text NOT NULL,
    duration text NOT NULL,
    user_id uuid NOT NULL
);
CREATE TABLE public.images (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    url text NOT NULL,
    food_id uuid NOT NULL
);
CREATE TABLE public.rating (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    rating integer NOT NULL,
    user_id uuid NOT NULL,
    food_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE public.steps (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    instruction text NOT NULL,
    "stepNumber" integer NOT NULL,
    food_id uuid NOT NULL
);
CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text,
    password text,
    "verificationToken" text,
    "verifyEmail" boolean DEFAULT true,
    image text DEFAULT 'https://res.cloudinary.com/blue-sky/image/upload/v1667216775/test/user_lwwpwc.jpg'::text
);
ALTER TABLE ONLY public."Ingredients"
    ADD CONSTRAINT "Ingredients_pkey" PRIMARY KEY ("Ingredient_id");
ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.food
    ADD CONSTRAINT food_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.rating
    ADD CONSTRAINT rating_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.steps
    ADD CONSTRAINT steps_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);
CREATE TRIGGER set_public_comments_updated_at BEFORE UPDATE ON public.comments FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_comments_updated_at ON public.comments IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_rating_updated_at BEFORE UPDATE ON public.rating FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_rating_updated_at ON public.rating IS 'trigger to set value of column "updated_at" to current timestamp on row update';
ALTER TABLE ONLY public."Ingredients"
    ADD CONSTRAINT "Ingredients_food_id_fkey" FOREIGN KEY (food_id) REFERENCES public.food(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_food_id_fkey FOREIGN KEY (food_id) REFERENCES public.food(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.food
    ADD CONSTRAINT food_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_food_id_fkey FOREIGN KEY (food_id) REFERENCES public.food(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.rating
    ADD CONSTRAINT rating_food_id_fkey FOREIGN KEY (food_id) REFERENCES public.food(id);
ALTER TABLE ONLY public.rating
    ADD CONSTRAINT rating_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.steps
    ADD CONSTRAINT steps_food_id_fkey FOREIGN KEY (food_id) REFERENCES public.food(id) ON UPDATE CASCADE ON DELETE CASCADE;
