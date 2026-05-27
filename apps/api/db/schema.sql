\restrict NCgfXsJV7nN5cXSjeUwIsF0iwuX1Nw9EBdInr4C9Zddx7HVIkRhr7cyeFcBhJKN

-- Dumped from database version 14.20 (Ubuntu 14.20-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.20 (Ubuntu 14.20-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: order_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.order_status AS ENUM (
    'draft',
    'open',
    'accepted',
    'picked_up',
    'delivered',
    'cancelled'
);


--
-- Name: payment_method; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.payment_method AS ENUM (
    'cash',
    'gcash'
);


--
-- Name: user_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_role AS ENUM (
    'customer',
    'vendor',
    'rider'
);


--
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN NEW.updated_at = CURRENT_TIMESTAMP;
RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.account (
    id text NOT NULL,
    "accountId" text NOT NULL,
    "providerId" text NOT NULL,
    "userId" text NOT NULL,
    "accessToken" text,
    "refreshToken" text,
    "idToken" text,
    "accessTokenExpiresAt" timestamp with time zone,
    "refreshTokenExpiresAt" timestamp with time zone,
    scope text,
    password text,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: order; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."order" (
    order_id text DEFAULT (gen_random_uuid())::text NOT NULL,
    customer_id text NOT NULL,
    store_id text NOT NULL,
    rider_id text,
    status public.order_status DEFAULT 'open'::public.order_status NOT NULL,
    payment_method public.payment_method NOT NULL,
    delivery_address text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: order_item; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_item (
    order_item_id text DEFAULT (gen_random_uuid())::text NOT NULL,
    order_id text NOT NULL,
    store_item_id text NOT NULL,
    price_snapshot numeric(10,2) NOT NULL,
    quantity integer NOT NULL,
    CONSTRAINT order_item_quantity_check CHECK ((quantity > 0))
);


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying NOT NULL
);


--
-- Name: session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.session (
    id text NOT NULL,
    "expiresAt" timestamp with time zone NOT NULL,
    token text NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    "userId" text NOT NULL
);


--
-- Name: store; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.store (
    store_id text DEFAULT (gen_random_uuid())::text NOT NULL,
    user_id text NOT NULL,
    store_name character varying(255) NOT NULL,
    store_address text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: store_item; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.store_item (
    store_item_id text DEFAULT (gen_random_uuid())::text NOT NULL,
    store_id text NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    is_available boolean DEFAULT true,
    image_url text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT store_item_price_check CHECK ((price >= (0)::numeric))
);


--
-- Name: user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."user" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    "emailVerified" boolean NOT NULL,
    image text,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    role text,
    phone_number text
);


--
-- Name: verification; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.verification (
    id text NOT NULL,
    identifier text NOT NULL,
    value text NOT NULL,
    "expiresAt" timestamp with time zone NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);


--
-- Name: order_item order_item_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT order_item_pkey PRIMARY KEY (order_item_id);


--
-- Name: order order_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_pkey PRIMARY KEY (order_id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (id);


--
-- Name: session session_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_token_key UNIQUE (token);


--
-- Name: store_item store_item_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_item
    ADD CONSTRAINT store_item_pkey PRIMARY KEY (store_item_id);


--
-- Name: store store_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store
    ADD CONSTRAINT store_pkey PRIMARY KEY (store_id);


--
-- Name: user user_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: verification verification_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.verification
    ADD CONSTRAINT verification_pkey PRIMARY KEY (id);


--
-- Name: account_userId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "account_userId_idx" ON public.account USING btree ("userId");


--
-- Name: idx_order_customer_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_order_customer_id ON public."order" USING btree (customer_id);


--
-- Name: idx_order_item_order_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_order_item_order_id ON public.order_item USING btree (order_id);


--
-- Name: idx_order_rider_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_order_rider_id ON public."order" USING btree (rider_id);


--
-- Name: idx_order_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_order_status ON public."order" USING btree (status);


--
-- Name: idx_order_store_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_order_store_id ON public."order" USING btree (store_id);


--
-- Name: idx_store_item_store_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_store_item_store_id ON public.store_item USING btree (store_id);


--
-- Name: idx_store_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_store_user_id ON public.store USING btree (user_id);


--
-- Name: session_userId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "session_userId_idx" ON public.session USING btree ("userId");


--
-- Name: verification_identifier_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX verification_identifier_idx ON public.verification USING btree (identifier);


--
-- Name: order trg_order_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_order_updated_at BEFORE UPDATE ON public."order" FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: account account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: order fk_order_customer; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT fk_order_customer FOREIGN KEY (customer_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: order_item fk_order_item_order; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT fk_order_item_order FOREIGN KEY (order_id) REFERENCES public."order"(order_id) ON DELETE CASCADE;


--
-- Name: order_item fk_order_item_store_item; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT fk_order_item_store_item FOREIGN KEY (store_item_id) REFERENCES public.store_item(store_item_id) ON DELETE RESTRICT;


--
-- Name: order fk_order_rider; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT fk_order_rider FOREIGN KEY (rider_id) REFERENCES public."user"(id) ON DELETE SET NULL;


--
-- Name: order fk_order_store; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT fk_order_store FOREIGN KEY (store_id) REFERENCES public.store(store_id) ON DELETE CASCADE;


--
-- Name: store_item fk_store_item_store; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_item
    ADD CONSTRAINT fk_store_item_store FOREIGN KEY (store_id) REFERENCES public.store(store_id) ON DELETE CASCADE;


--
-- Name: store fk_store_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store
    ADD CONSTRAINT fk_store_user FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: session session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict NCgfXsJV7nN5cXSjeUwIsF0iwuX1Nw9EBdInr4C9Zddx7HVIkRhr7cyeFcBhJKN


--
-- Dbmate schema migrations
--

INSERT INTO public.schema_migrations (version) VALUES
    ('20260509175040'),
    ('20260510051607'),
    ('20260511153205'),
    ('20260511153313'),
    ('20260526101559');
