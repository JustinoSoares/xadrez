--
-- PostgreSQL database dump
--

-- Dumped from database version 16.6
-- Dumped by pg_dump version 16.6 (Debian 16.6-1.pgdg120+1)

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
-- Name: enum_Adversarios_status; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."enum_Adversarios_status" AS ENUM (
    'open',
    'closed'
);


ALTER TYPE public."enum_Adversarios_status" OWNER TO neondb_owner;

--
-- Name: enum_Torneios_status; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."enum_Torneios_status" AS ENUM (
    'open',
    'closed',
    'current'
);


ALTER TYPE public."enum_Torneios_status" OWNER TO neondb_owner;

--
-- Name: enum_Torneios_type; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."enum_Torneios_type" AS ENUM (
    'allvsall',
    'eliminatoria'
);


ALTER TYPE public."enum_Torneios_type" OWNER TO neondb_owner;

--
-- Name: enum_UsuarioTorneios_status; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."enum_UsuarioTorneios_status" AS ENUM (
    'on',
    'off'
);


ALTER TYPE public."enum_UsuarioTorneios_status" OWNER TO neondb_owner;

--
-- Name: enum_Usuarios_tipo_usuario; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."enum_Usuarios_tipo_usuario" AS ENUM (
    'admin',
    'normal'
);


ALTER TYPE public."enum_Usuarios_tipo_usuario" OWNER TO neondb_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Adversarios; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Adversarios" (
    id uuid NOT NULL,
    "torneioId" uuid NOT NULL,
    "jogador1Id" uuid NOT NULL,
    "jogador2Id" uuid NOT NULL,
    status public."enum_Adversarios_status" NOT NULL,
    winner character varying(255) DEFAULT NULL::character varying,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    rodada integer DEFAULT 1
);


ALTER TABLE public."Adversarios" OWNER TO neondb_owner;

--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO neondb_owner;

--
-- Name: Torneios; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Torneios" (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    pass character varying(255) NOT NULL,
    date_start timestamp with time zone,
    "usuarioId" uuid NOT NULL,
    status public."enum_Torneios_status" DEFAULT 'open'::public."enum_Torneios_status" NOT NULL,
    type public."enum_Torneios_type" DEFAULT 'allvsall'::public."enum_Torneios_type" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Torneios" OWNER TO neondb_owner;

--
-- Name: UsuarioTorneios; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."UsuarioTorneios" (
    id uuid NOT NULL,
    "usuarioId" uuid NOT NULL,
    "torneioId" uuid NOT NULL,
    status public."enum_UsuarioTorneios_status" NOT NULL,
    pontos integer DEFAULT 0,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."UsuarioTorneios" OWNER TO neondb_owner;

--
-- Name: Usuarios; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Usuarios" (
    id uuid NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    country character varying(255) DEFAULT 'Angola'::character varying NOT NULL,
    tipo_usuario public."enum_Usuarios_tipo_usuario" NOT NULL,
    pontos integer DEFAULT 0,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Usuarios" OWNER TO neondb_owner;

--
-- Data for Name: Adversarios; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Adversarios" (id, "torneioId", "jogador1Id", "jogador2Id", status, winner, "createdAt", "updatedAt", rodada) FROM stdin;
c1247b53-a007-4088-89b1-82a4dab4ea52	32888420-4e27-4fa7-adb8-7918ffbe504a	c43d0330-8c54-487b-93b3-06b2a312fc04	3f64636a-ee66-44d7-9886-6ff720ff4aae	open	msalembe	2025-01-30 09:51:45.16+00	2025-01-31 08:24:38.013+00	1
4e75dde9-a461-40f9-9fd5-ffa0732a5be9	32888420-4e27-4fa7-adb8-7918ffbe504a	12a89c7b-b032-4ab0-a9ad-e328f336642b	4bbef721-c967-42e9-9eb1-97d1cbfd1275	open	mila	2025-01-30 09:51:44.664+00	2025-01-31 08:24:42.515+00	1
b6a1fe76-d254-4d03-99c3-2e59dbd5719a	32888420-4e27-4fa7-adb8-7918ffbe504a	3f64636a-ee66-44d7-9886-6ff720ff4aae	4bbef721-c967-42e9-9eb1-97d1cbfd1275	open	clara	2025-01-30 09:51:45.544+00	2025-01-31 08:24:51.592+00	1
6ad9c97d-22d8-40bc-b1be-b855a7cf852b	32888420-4e27-4fa7-adb8-7918ffbe504a	12a89c7b-b032-4ab0-a9ad-e328f336642b	a012999d-5fa0-47ca-ae6e-45f010fb5328	open	jsoares	2025-01-30 09:51:43.982+00	2025-01-31 08:25:00.377+00	1
febbdb35-916c-4682-b0bb-e08cba31a241	32888420-4e27-4fa7-adb8-7918ffbe504a	a012999d-5fa0-47ca-ae6e-45f010fb5328	be12b143-3518-4278-adba-7b9096627c14	open	jsoares	2025-01-30 09:51:44.968+00	2025-01-31 08:25:21.604+00	1
affc1999-539e-4e43-a484-9a3aa28b4347	32888420-4e27-4fa7-adb8-7918ffbe504a	12a89c7b-b032-4ab0-a9ad-e328f336642b	c43d0330-8c54-487b-93b3-06b2a312fc04	open	msalembe	2025-01-30 09:51:44.079+00	2025-01-31 08:25:27.784+00	1
23cdde13-538c-4d0d-99dc-a3450264ae6f	3880a16f-830d-46d0-a41d-3d71ffc1e817	be12b143-3518-4278-adba-7b9096627c14	3f64636a-ee66-44d7-9886-6ff720ff4aae	open	tuninho	2025-01-30 09:48:29.375+00	2025-01-30 09:48:34.043+00	1
82c674d9-bc8f-4fbd-81fc-cd2a9f855f20	3880a16f-830d-46d0-a41d-3d71ffc1e817	c43d0330-8c54-487b-93b3-06b2a312fc04	4bbef721-c967-42e9-9eb1-97d1cbfd1275	open	mila	2025-01-30 09:48:29.568+00	2025-01-30 09:48:44.09+00	1
8ffd3ca1-6496-4cdc-bb68-f0071ba5c5cb	3880a16f-830d-46d0-a41d-3d71ffc1e817	12a89c7b-b032-4ab0-a9ad-e328f336642b	a012999d-5fa0-47ca-ae6e-45f010fb5328	open	jsoares	2025-01-30 09:48:29.174+00	2025-01-30 09:48:48.729+00	1
3c4588b1-58ab-487f-b9b6-ff49747681b0	32888420-4e27-4fa7-adb8-7918ffbe504a	be12b143-3518-4278-adba-7b9096627c14	4bbef721-c967-42e9-9eb1-97d1cbfd1275	open	mila	2025-01-30 09:51:45.64+00	2025-01-30 09:53:15.28+00	1
4471eb6c-e148-4d68-943a-cdd9cc374775	32888420-4e27-4fa7-adb8-7918ffbe504a	12a89c7b-b032-4ab0-a9ad-e328f336642b	be12b143-3518-4278-adba-7b9096627c14	open	tuninho	2025-01-30 09:51:44.471+00	2025-01-30 09:53:43.479+00	1
4512678e-75b3-409f-9934-b56bc557a5f7	00f75f67-7f38-437d-bf26-afd413bec85c	4bbef721-c967-42e9-9eb1-97d1cbfd1275	12a89c7b-b032-4ab0-a9ad-e328f336642b	open	\N	2025-01-30 10:16:56.681+00	2025-01-30 10:16:56.681+00	1
6087914b-7724-4fdb-ae5e-d26af4175eaf	00f75f67-7f38-437d-bf26-afd413bec85c	4bbef721-c967-42e9-9eb1-97d1cbfd1275	3f64636a-ee66-44d7-9886-6ff720ff4aae	open	\N	2025-01-30 10:16:56.872+00	2025-01-30 10:16:56.872+00	1
c88fbebf-8868-480e-87c4-7475ae6598b3	00f75f67-7f38-437d-bf26-afd413bec85c	4bbef721-c967-42e9-9eb1-97d1cbfd1275	a012999d-5fa0-47ca-ae6e-45f010fb5328	open	\N	2025-01-30 10:16:57.062+00	2025-01-30 10:16:57.062+00	1
89dcae70-70d0-470d-a3db-7aa3ee151283	00f75f67-7f38-437d-bf26-afd413bec85c	12a89c7b-b032-4ab0-a9ad-e328f336642b	3f64636a-ee66-44d7-9886-6ff720ff4aae	open	\N	2025-01-30 10:16:57.253+00	2025-01-30 10:16:57.253+00	1
a51bcdcb-cbce-48e6-8438-a3ff0de6d4e1	00f75f67-7f38-437d-bf26-afd413bec85c	12a89c7b-b032-4ab0-a9ad-e328f336642b	a012999d-5fa0-47ca-ae6e-45f010fb5328	open	\N	2025-01-30 10:16:57.444+00	2025-01-30 10:16:57.444+00	1
3a779e5c-cfcb-410c-a013-794993b7d5e7	00f75f67-7f38-437d-bf26-afd413bec85c	be12b143-3518-4278-adba-7b9096627c14	c43d0330-8c54-487b-93b3-06b2a312fc04	open	\N	2025-01-30 10:16:57.634+00	2025-01-30 10:16:57.634+00	1
48e717f3-83e0-40a1-98d7-2d9c6f8f94c1	00f75f67-7f38-437d-bf26-afd413bec85c	3f64636a-ee66-44d7-9886-6ff720ff4aae	c43d0330-8c54-487b-93b3-06b2a312fc04	open	\N	2025-01-30 10:16:57.825+00	2025-01-30 10:16:57.825+00	1
fe79b65f-8614-462e-8f7e-2281b47e510e	32888420-4e27-4fa7-adb8-7918ffbe504a	12a89c7b-b032-4ab0-a9ad-e328f336642b	3f64636a-ee66-44d7-9886-6ff720ff4aae	open	mtosse	2025-01-30 09:51:44.277+00	2025-01-30 12:55:43.705+00	1
e8636db8-db30-489b-ab39-09468297ce8c	32888420-4e27-4fa7-adb8-7918ffbe504a	c43d0330-8c54-487b-93b3-06b2a312fc04	4bbef721-c967-42e9-9eb1-97d1cbfd1275	open	msalembe	2025-01-30 09:51:45.352+00	2025-01-30 12:57:52.59+00	1
4a4db299-ee33-4f94-b90b-c94e4920d14a	c66e7a6b-0c91-472b-b712-cb1db7a706ac	c43d0330-8c54-487b-93b3-06b2a312fc04	12a89c7b-b032-4ab0-a9ad-e328f336642b	open	\N	2025-01-30 14:58:25.695+00	2025-01-30 14:58:25.695+00	1
14e0a20a-2150-4845-bcd0-d8f94800c9c6	c66e7a6b-0c91-472b-b712-cb1db7a706ac	c43d0330-8c54-487b-93b3-06b2a312fc04	a012999d-5fa0-47ca-ae6e-45f010fb5328	open	\N	2025-01-30 14:58:25.892+00	2025-01-30 14:58:25.892+00	1
6f96cf20-3f77-41e4-98ea-ebc0e7bba83e	c66e7a6b-0c91-472b-b712-cb1db7a706ac	c43d0330-8c54-487b-93b3-06b2a312fc04	3f64636a-ee66-44d7-9886-6ff720ff4aae	open	\N	2025-01-30 14:58:26.089+00	2025-01-30 14:58:26.089+00	1
ca5d3df4-cb74-456f-80ae-ce6e5072532b	c66e7a6b-0c91-472b-b712-cb1db7a706ac	12a89c7b-b032-4ab0-a9ad-e328f336642b	a012999d-5fa0-47ca-ae6e-45f010fb5328	open	\N	2025-01-30 14:58:26.287+00	2025-01-30 14:58:26.287+00	1
d4408ff5-5723-4224-8b19-d222d35d0c2c	c66e7a6b-0c91-472b-b712-cb1db7a706ac	12a89c7b-b032-4ab0-a9ad-e328f336642b	3f64636a-ee66-44d7-9886-6ff720ff4aae	open	\N	2025-01-30 14:58:26.488+00	2025-01-30 14:58:26.488+00	1
c2f66ea7-354a-452e-9f90-196abe2054a7	c66e7a6b-0c91-472b-b712-cb1db7a706ac	be12b143-3518-4278-adba-7b9096627c14	4bbef721-c967-42e9-9eb1-97d1cbfd1275	open	\N	2025-01-30 14:58:26.685+00	2025-01-30 14:58:26.685+00	1
36323673-875a-4bca-a3fe-7142fed0455f	c66e7a6b-0c91-472b-b712-cb1db7a706ac	a012999d-5fa0-47ca-ae6e-45f010fb5328	4bbef721-c967-42e9-9eb1-97d1cbfd1275	open	\N	2025-01-30 14:58:26.882+00	2025-01-30 14:58:26.882+00	1
46dd5cf9-f69d-4747-8c98-83c26d911ff5	7c099cd5-039e-4f69-87f4-5f375d298776	c43d0330-8c54-487b-93b3-06b2a312fc04	3f64636a-ee66-44d7-9886-6ff720ff4aae	open	msalembe	2025-01-31 08:28:50.433+00	2025-01-31 08:28:58.081+00	1
b32b9647-c859-43f8-9930-e151e5fcf351	7c099cd5-039e-4f69-87f4-5f375d298776	a012999d-5fa0-47ca-ae6e-45f010fb5328	4bbef721-c967-42e9-9eb1-97d1cbfd1275	open	mila	2025-01-31 08:28:50.627+00	2025-01-31 08:29:20.109+00	1
647bb873-417a-4dc4-8576-732471928e58	7c099cd5-039e-4f69-87f4-5f375d298776	12a89c7b-b032-4ab0-a9ad-e328f336642b	be12b143-3518-4278-adba-7b9096627c14	open	tuninho	2025-01-31 08:28:50.215+00	2025-01-31 08:29:42.302+00	1
fa50fd97-d786-45b7-b2a5-a47e9b79d1c5	3880a16f-830d-46d0-a41d-3d71ffc1e817	be12b143-3518-4278-adba-7b9096627c14	4bbef721-c967-42e9-9eb1-97d1cbfd1275	open	tuninho	2025-01-30 09:48:53.03+00	2025-01-30 09:48:57.041+00	2
d707bcc5-4336-44a2-b6ad-542f9e5e1d93	00f75f67-7f38-437d-bf26-afd413bec85c	4bbef721-c967-42e9-9eb1-97d1cbfd1275	be12b143-3518-4278-adba-7b9096627c14	open	\N	2025-01-30 10:16:56.776+00	2025-01-30 10:16:56.776+00	1
bf153cc8-3dfb-4ff6-af80-c9157d6ea6b9	00f75f67-7f38-437d-bf26-afd413bec85c	4bbef721-c967-42e9-9eb1-97d1cbfd1275	c43d0330-8c54-487b-93b3-06b2a312fc04	open	\N	2025-01-30 10:16:56.967+00	2025-01-30 10:16:56.967+00	1
518689e6-aa4c-4d0c-b55a-2aab980ec1bb	00f75f67-7f38-437d-bf26-afd413bec85c	12a89c7b-b032-4ab0-a9ad-e328f336642b	be12b143-3518-4278-adba-7b9096627c14	open	\N	2025-01-30 10:16:57.158+00	2025-01-30 10:16:57.158+00	1
dcf2ad1e-bf8f-4107-b83c-fa77bb4c939f	00f75f67-7f38-437d-bf26-afd413bec85c	12a89c7b-b032-4ab0-a9ad-e328f336642b	c43d0330-8c54-487b-93b3-06b2a312fc04	open	\N	2025-01-30 10:16:57.349+00	2025-01-30 10:16:57.349+00	1
cd9fa436-627d-4e73-95c7-c65cff180d2b	00f75f67-7f38-437d-bf26-afd413bec85c	be12b143-3518-4278-adba-7b9096627c14	3f64636a-ee66-44d7-9886-6ff720ff4aae	open	\N	2025-01-30 10:16:57.539+00	2025-01-30 10:16:57.539+00	1
bbab6851-115b-48b2-a1f7-c5a6387c77d5	00f75f67-7f38-437d-bf26-afd413bec85c	be12b143-3518-4278-adba-7b9096627c14	a012999d-5fa0-47ca-ae6e-45f010fb5328	open	\N	2025-01-30 10:16:57.73+00	2025-01-30 10:16:57.73+00	1
e7bfa517-89a4-4f97-805e-6189b073a63a	00f75f67-7f38-437d-bf26-afd413bec85c	3f64636a-ee66-44d7-9886-6ff720ff4aae	a012999d-5fa0-47ca-ae6e-45f010fb5328	open	\N	2025-01-30 10:16:57.921+00	2025-01-30 10:16:57.921+00	1
4ef9d9ef-38b7-4d62-992a-69ab6c3cd867	c66e7a6b-0c91-472b-b712-cb1db7a706ac	c43d0330-8c54-487b-93b3-06b2a312fc04	be12b143-3518-4278-adba-7b9096627c14	open	\N	2025-01-30 14:58:25.794+00	2025-01-30 14:58:25.794+00	1
9226445b-5f00-432f-9c6e-15ce8d2c57a5	c66e7a6b-0c91-472b-b712-cb1db7a706ac	c43d0330-8c54-487b-93b3-06b2a312fc04	4bbef721-c967-42e9-9eb1-97d1cbfd1275	open	\N	2025-01-30 14:58:25.991+00	2025-01-30 14:58:25.991+00	1
9360ea60-994a-4852-9897-3faf9925550a	c66e7a6b-0c91-472b-b712-cb1db7a706ac	12a89c7b-b032-4ab0-a9ad-e328f336642b	be12b143-3518-4278-adba-7b9096627c14	open	\N	2025-01-30 14:58:26.188+00	2025-01-30 14:58:26.188+00	1
f1b78c17-0abb-4f60-9a9e-5c7e8f8349b2	c66e7a6b-0c91-472b-b712-cb1db7a706ac	12a89c7b-b032-4ab0-a9ad-e328f336642b	4bbef721-c967-42e9-9eb1-97d1cbfd1275	open	\N	2025-01-30 14:58:26.385+00	2025-01-30 14:58:26.385+00	1
52ac5d82-eb0b-4386-bf77-b2863da147a4	c66e7a6b-0c91-472b-b712-cb1db7a706ac	be12b143-3518-4278-adba-7b9096627c14	a012999d-5fa0-47ca-ae6e-45f010fb5328	open	\N	2025-01-30 14:58:26.587+00	2025-01-30 14:58:26.587+00	1
7fdda677-2cb0-4b61-9633-b585f01c95f8	c66e7a6b-0c91-472b-b712-cb1db7a706ac	be12b143-3518-4278-adba-7b9096627c14	3f64636a-ee66-44d7-9886-6ff720ff4aae	open	\N	2025-01-30 14:58:26.784+00	2025-01-30 14:58:26.784+00	1
9b17f8f5-30be-447b-b968-53f56a56b4c4	c66e7a6b-0c91-472b-b712-cb1db7a706ac	a012999d-5fa0-47ca-ae6e-45f010fb5328	3f64636a-ee66-44d7-9886-6ff720ff4aae	open	\N	2025-01-30 14:58:26.981+00	2025-01-30 14:58:26.981+00	1
93600637-4fb0-4167-aa29-4757e99a2381	32888420-4e27-4fa7-adb8-7918ffbe504a	a012999d-5fa0-47ca-ae6e-45f010fb5328	c43d0330-8c54-487b-93b3-06b2a312fc04	open	msalembe	2025-01-30 09:51:44.769+00	2025-01-31 08:24:56.066+00	1
2f418e78-3b39-4a9b-8dc5-1012082b7f92	7c099cd5-039e-4f69-87f4-5f375d298776	c43d0330-8c54-487b-93b3-06b2a312fc04	4bbef721-c967-42e9-9eb1-97d1cbfd1275	open	msalembe	2025-01-31 08:29:58.803+00	2025-01-31 08:30:04.546+00	2
e3a99e4c-14ab-41cd-89e1-4fa3d734ddf7	3880a16f-830d-46d0-a41d-3d71ffc1e817	a012999d-5fa0-47ca-ae6e-45f010fb5328	be12b143-3518-4278-adba-7b9096627c14	open	jsoares	2025-01-30 09:49:07.381+00	2025-01-30 09:49:11.195+00	3
ddc2b60e-1492-4ff0-91ce-a7fb642f3a12	00f75f67-7f38-437d-bf26-afd413bec85c	c43d0330-8c54-487b-93b3-06b2a312fc04	a012999d-5fa0-47ca-ae6e-45f010fb5328	open	\N	2025-01-30 10:16:58.017+00	2025-01-30 10:16:58.017+00	1
58cd2b79-7814-4c1f-9fab-8507c7bb33e4	32888420-4e27-4fa7-adb8-7918ffbe504a	3f64636a-ee66-44d7-9886-6ff720ff4aae	be12b143-3518-4278-adba-7b9096627c14	open	tuninho	2025-01-30 09:51:45.448+00	2025-01-30 12:36:25.289+00	1
f45447da-1aba-457e-849c-83d9501b920f	c66e7a6b-0c91-472b-b712-cb1db7a706ac	4bbef721-c967-42e9-9eb1-97d1cbfd1275	3f64636a-ee66-44d7-9886-6ff720ff4aae	open	\N	2025-01-30 14:58:27.079+00	2025-01-30 14:58:27.079+00	1
3de19add-65cd-4f8a-adce-aa91363a2f30	32888420-4e27-4fa7-adb8-7918ffbe504a	c43d0330-8c54-487b-93b3-06b2a312fc04	be12b143-3518-4278-adba-7b9096627c14	open	msalembe	2025-01-30 09:51:45.256+00	2025-01-31 08:24:33.889+00	1
bc784953-c0db-4873-98f9-3994d39cdbf8	32888420-4e27-4fa7-adb8-7918ffbe504a	a012999d-5fa0-47ca-ae6e-45f010fb5328	3f64636a-ee66-44d7-9886-6ff720ff4aae	open	jsoares	2025-01-30 09:51:44.871+00	2025-01-31 08:24:47.136+00	1
fb096323-0697-44e2-8035-c88c665673e4	32888420-4e27-4fa7-adb8-7918ffbe504a	a012999d-5fa0-47ca-ae6e-45f010fb5328	4bbef721-c967-42e9-9eb1-97d1cbfd1275	open	jsoares	2025-01-30 09:51:45.064+00	2025-01-31 08:25:05.16+00	1
11e59c9d-b5db-4ef5-92bd-052d1fb1ebe2	7c099cd5-039e-4f69-87f4-5f375d298776	be12b143-3518-4278-adba-7b9096627c14	c43d0330-8c54-487b-93b3-06b2a312fc04	open	msalembe	2025-01-31 08:30:10.163+00	2025-01-31 08:30:13.674+00	3
\.


--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."SequelizeMeta" (name) FROM stdin;
20241203222846-create-usuario.js
20241203222951-create-torneio.js
20241203223038-create-usuario-torneio.js
20241203223123-create-adversarios.js
\.


--
-- Data for Name: Torneios; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Torneios" (id, name, pass, date_start, "usuarioId", status, type, "createdAt", "updatedAt") FROM stdin;
e7da0329-5fd9-4264-818b-653b7937b254	Monster	$2b$10$2VAxpubygEMlfem127bwn.Pf5V61yZrOW7.zXh8bVYrIPMdZxnqJy	2025-02-07 00:29:00+00	abd5c5ad-79ec-4370-bf50-7f5a266304d5	current	eliminatoria	2025-01-29 23:29:25.525+00	2025-01-30 07:14:04.94+00
3880a16f-830d-46d0-a41d-3d71ffc1e817	Monster 2	$2b$10$g8lupOnplxDajC4D5YvJ1eIIRmF4MpPy7Od7pob3gS6THccQNYV3W	2025-02-07 00:29:00+00	abd5c5ad-79ec-4370-bf50-7f5a266304d5	closed	eliminatoria	2025-01-29 23:29:41.813+00	2025-01-30 09:49:12.155+00
c66e7a6b-0c91-472b-b712-cb1db7a706ac	Mongoose	$2b$10$k9M7hWpO/o/Y04LT63WxVOwF7p9ChtQnFHuMInc6Liljh38Hhxyhe	2025-02-07 00:17:00+00	abd5c5ad-79ec-4370-bf50-7f5a266304d5	current	allvsall	2025-01-29 23:13:08.417+00	2025-01-30 14:58:27.08+00
32888420-4e27-4fa7-adb8-7918ffbe504a	Mongoose 4	$2b$10$8MGN4oFB2jRQRq4/.8swyeqaqSd2RxCP3WR8zltRzsYuFE5U0Z4ya	2025-02-07 00:31:00+00	abd5c5ad-79ec-4370-bf50-7f5a266304d5	closed	allvsall	2025-01-29 23:28:38.314+00	2025-01-31 08:25:28.889+00
7c099cd5-039e-4f69-87f4-5f375d298776	Monster 3	$2b$10$nfcO4RhZg0xxTHHtcgXHCOVqn9LlU1Kp/oHZwCzfFmZfzflmry12S	2025-01-31 00:29:00+00	abd5c5ad-79ec-4370-bf50-7f5a266304d5	closed	eliminatoria	2025-01-29 23:30:00.003+00	2025-01-31 08:30:14.745+00
00f75f67-7f38-437d-bf26-afd413bec85c	Mongoose 3	$2b$10$0BPHvKP5jJGrAqnDUw1A8.v28v3oOUvPJYhER6/O8gp.RK.RIO.N.	2025-02-08 00:28:00+00	abd5c5ad-79ec-4370-bf50-7f5a266304d5	closed	allvsall	2025-01-29 23:28:16.105+00	2025-01-31 09:05:12.648+00
67fa9a04-5086-42a7-919a-d132112c8b82	Monster 4	$2b$10$7T9/LiSJ5DA2l/6yg9lRs.7Ksv4NBrYbEZ2esrqZsMneJ3C95eSXa	2025-02-08 00:30:00+00	abd5c5ad-79ec-4370-bf50-7f5a266304d5	open	eliminatoria	2025-01-29 23:30:18.018+00	2025-01-30 07:57:13.137+00
0baf0db3-b8e9-427e-8946-3dd027b3b471	Mongoose 2	$2b$10$cYaRcnx/oQX2A55sQB6KD.G8dItyD7XtVp6AqmPVZiINQN6Apkr8u	2025-02-07 00:27:00+00	abd5c5ad-79ec-4370-bf50-7f5a266304d5	open	allvsall	2025-01-29 23:27:54.016+00	2025-01-30 06:29:21.761+00
\.


--
-- Data for Name: UsuarioTorneios; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."UsuarioTorneios" (id, "usuarioId", "torneioId", status, pontos, "createdAt", "updatedAt") FROM stdin;
a6392976-30ce-4948-9a82-21a1909a7b0b	c43d0330-8c54-487b-93b3-06b2a312fc04	c66e7a6b-0c91-472b-b712-cb1db7a706ac	on	2	2025-01-29 23:43:14.209+00	2025-01-30 07:04:54.303+00
10ee16e7-555e-4f17-a598-ff0607514f86	12a89c7b-b032-4ab0-a9ad-e328f336642b	32888420-4e27-4fa7-adb8-7918ffbe504a	on	1	2025-01-29 23:40:43.616+00	2025-01-30 12:55:43.608+00
cb9d4a11-958f-4a20-afd4-e56cacc5c269	be12b143-3518-4278-adba-7b9096627c14	e7da0329-5fd9-4264-818b-653b7937b254	on	0	2025-01-29 23:45:12.31+00	2025-01-30 02:28:00.613+00
ebb0a29a-8945-4c44-a8d1-1d795409e850	12a89c7b-b032-4ab0-a9ad-e328f336642b	c66e7a6b-0c91-472b-b712-cb1db7a706ac	on	2	2025-01-29 23:41:09.121+00	2025-01-30 07:04:59.195+00
a7f7f910-3e44-4d60-b74c-91e403d56d12	12a89c7b-b032-4ab0-a9ad-e328f336642b	67fa9a04-5086-42a7-919a-d132112c8b82	on	3	2025-01-29 23:40:11.821+00	2025-01-30 07:57:10.36+00
8ab4a11a-ac86-4e99-9dfc-c75a08905ecd	be12b143-3518-4278-adba-7b9096627c14	c66e7a6b-0c91-472b-b712-cb1db7a706ac	on	5	2025-01-29 23:45:45.011+00	2025-01-30 07:05:16.083+00
c843de84-851a-4410-bf9e-189aeb3218b6	3f64636a-ee66-44d7-9886-6ff720ff4aae	0baf0db3-b8e9-427e-8946-3dd027b3b471	on	0	2025-01-29 23:32:17.715+00	2025-01-29 23:32:17.715+00
0e622272-47a1-4017-8c0d-69bde1557eb5	a012999d-5fa0-47ca-ae6e-45f010fb5328	0baf0db3-b8e9-427e-8946-3dd027b3b471	on	0	2025-01-29 23:37:08.812+00	2025-01-29 23:37:08.812+00
51d89ffa-7dd6-43bf-b547-7b146b6cb146	4bbef721-c967-42e9-9eb1-97d1cbfd1275	00f75f67-7f38-437d-bf26-afd413bec85c	on	0	2025-01-29 23:38:43.614+00	2025-01-29 23:38:43.614+00
55d6d02e-4be3-42f8-96a9-9f35653d0761	4bbef721-c967-42e9-9eb1-97d1cbfd1275	0baf0db3-b8e9-427e-8946-3dd027b3b471	on	0	2025-01-29 23:38:50.417+00	2025-01-29 23:38:50.417+00
e834abcc-9420-4dd8-9137-fd6b1c44375a	12a89c7b-b032-4ab0-a9ad-e328f336642b	00f75f67-7f38-437d-bf26-afd413bec85c	on	0	2025-01-29 23:40:49.912+00	2025-01-29 23:40:49.912+00
ed9f4f48-5d30-4cfd-941c-d3326cbf0e19	12a89c7b-b032-4ab0-a9ad-e328f336642b	0baf0db3-b8e9-427e-8946-3dd027b3b471	on	0	2025-01-29 23:41:01.611+00	2025-01-29 23:41:01.611+00
86e67763-ab0e-42e3-9df9-c6e872bbedf7	c43d0330-8c54-487b-93b3-06b2a312fc04	0baf0db3-b8e9-427e-8946-3dd027b3b471	on	0	2025-01-29 23:43:00.009+00	2025-01-29 23:43:00.009+00
ac690e49-3e6a-4ff5-a73f-900a5477a0bd	be12b143-3518-4278-adba-7b9096627c14	00f75f67-7f38-437d-bf26-afd413bec85c	on	0	2025-01-29 23:45:32.51+00	2025-01-29 23:45:32.51+00
7f5f8e88-7a0e-4077-878a-81c0bce7b2a3	be12b143-3518-4278-adba-7b9096627c14	0baf0db3-b8e9-427e-8946-3dd027b3b471	on	0	2025-01-29 23:45:38.611+00	2025-01-29 23:45:38.611+00
107c4944-3eaf-4e77-b76a-596e53ff850d	a012999d-5fa0-47ca-ae6e-45f010fb5328	e7da0329-5fd9-4264-818b-653b7937b254	on	0	2025-01-29 23:36:55.312+00	2025-01-30 03:01:20.807+00
1d068674-af85-4679-aeca-a71e0f16d4c4	c43d0330-8c54-487b-93b3-06b2a312fc04	e7da0329-5fd9-4264-818b-653b7937b254	on	0	2025-01-29 23:42:46.413+00	2025-01-30 02:38:35.937+00
ef77f61d-d8ae-44b7-b4be-d63614e82c9c	4bbef721-c967-42e9-9eb1-97d1cbfd1275	32888420-4e27-4fa7-adb8-7918ffbe504a	on	2	2025-01-29 23:38:37.314+00	2025-01-31 08:24:42.416+00
b762649e-1bd2-424e-aef2-4d88983342ee	3f64636a-ee66-44d7-9886-6ff720ff4aae	32888420-4e27-4fa7-adb8-7918ffbe504a	on	1	2025-01-29 23:31:59.332+00	2025-01-31 08:24:51.495+00
390c7329-f236-4983-9a20-45418801dc80	3f64636a-ee66-44d7-9886-6ff720ff4aae	00f75f67-7f38-437d-bf26-afd413bec85c	on	0	2025-01-29 23:32:06.417+00	2025-01-30 02:40:14.635+00
a9b02b57-fca7-44a9-b772-c67a8c7a354b	c43d0330-8c54-487b-93b3-06b2a312fc04	00f75f67-7f38-437d-bf26-afd413bec85c	on	2	2025-01-29 23:43:07.804+00	2025-01-30 06:56:15.891+00
4f8a33bd-cab1-42aa-a856-ad1ddccdf14c	a012999d-5fa0-47ca-ae6e-45f010fb5328	00f75f67-7f38-437d-bf26-afd413bec85c	on	0	2025-01-29 23:37:15.413+00	2025-01-30 02:35:16.691+00
2d262e58-40a2-4649-92d8-a863bc03cb93	a012999d-5fa0-47ca-ae6e-45f010fb5328	32888420-4e27-4fa7-adb8-7918ffbe504a	on	4	2025-01-29 23:37:02.11+00	2025-01-31 08:25:21.508+00
7821c943-c296-4d41-838e-16823c12d887	12a89c7b-b032-4ab0-a9ad-e328f336642b	e7da0329-5fd9-4264-818b-653b7937b254	on	0	2025-01-29 23:40:34.31+00	2025-01-30 03:01:21.099+00
5327e012-0aa6-4bf1-b17a-1e37016d144f	c43d0330-8c54-487b-93b3-06b2a312fc04	32888420-4e27-4fa7-adb8-7918ffbe504a	on	5	2025-01-29 23:42:53.109+00	2025-01-31 08:25:27.688+00
378fcc48-4a16-4298-a98f-0b1b643b3e06	3f64636a-ee66-44d7-9886-6ff720ff4aae	3880a16f-830d-46d0-a41d-3d71ffc1e817	off	4	2025-01-29 23:31:44.512+00	2025-01-30 09:48:34.237+00
2df59014-9e5b-4d21-8c9b-9e5525e51efb	3f64636a-ee66-44d7-9886-6ff720ff4aae	7c099cd5-039e-4f69-87f4-5f375d298776	off	0	2025-01-29 23:31:37.52+00	2025-01-31 08:28:58.278+00
069fb888-d539-46a2-9a19-511daba03a1c	3f64636a-ee66-44d7-9886-6ff720ff4aae	e7da0329-5fd9-4264-818b-653b7937b254	on	0	2025-01-29 23:31:51.019+00	2025-01-30 02:37:47.044+00
51785c19-f504-4d10-9838-b4a0cc21cef6	c43d0330-8c54-487b-93b3-06b2a312fc04	3880a16f-830d-46d0-a41d-3d71ffc1e817	off	0	2025-01-29 23:42:40.313+00	2025-01-30 09:48:44.283+00
d68c0296-6115-4bdc-af7f-020dec81eef0	a012999d-5fa0-47ca-ae6e-45f010fb5328	7c099cd5-039e-4f69-87f4-5f375d298776	off	0	2025-01-29 23:36:41.814+00	2025-01-31 08:29:20.305+00
334cb5c7-29f2-49de-8f1f-9dc9bbeaa96d	a012999d-5fa0-47ca-ae6e-45f010fb5328	67fa9a04-5086-42a7-919a-d132112c8b82	on	2	2025-01-29 23:36:35.31+00	2025-01-30 07:51:03.464+00
10cab527-a5f5-4824-9b36-14dab7177bc7	12a89c7b-b032-4ab0-a9ad-e328f336642b	7c099cd5-039e-4f69-87f4-5f375d298776	off	0	2025-01-29 23:40:18.302+00	2025-01-31 08:29:42.495+00
1713d530-72ee-45d2-8ea3-56b0f9bb69fc	a012999d-5fa0-47ca-ae6e-45f010fb5328	c66e7a6b-0c91-472b-b712-cb1db7a706ac	on	2	2025-01-29 23:37:21.213+00	2025-01-30 07:04:28.248+00
6e4a330c-979f-4a33-b118-a221747e5121	3f64636a-ee66-44d7-9886-6ff720ff4aae	67fa9a04-5086-42a7-919a-d132112c8b82	on	1	2025-01-29 23:31:31.211+00	2025-01-30 07:55:00.495+00
345a8f4d-edc1-47b1-9e7f-17f239cdb4a6	12a89c7b-b032-4ab0-a9ad-e328f336642b	3880a16f-830d-46d0-a41d-3d71ffc1e817	off	3	2025-01-29 23:40:25.216+00	2025-01-30 09:48:48.922+00
21844699-ff8f-40c7-99cd-6f95f92ed884	4bbef721-c967-42e9-9eb1-97d1cbfd1275	c66e7a6b-0c91-472b-b712-cb1db7a706ac	on	1	2025-01-29 23:38:56.722+00	2025-01-30 07:04:38.111+00
89696277-eecb-4b06-922a-a8780bfad371	be12b143-3518-4278-adba-7b9096627c14	67fa9a04-5086-42a7-919a-d132112c8b82	on	1	2025-01-29 23:44:52.911+00	2025-01-30 07:48:40.833+00
c851998b-3028-4487-b5e6-695828421099	c43d0330-8c54-487b-93b3-06b2a312fc04	67fa9a04-5086-42a7-919a-d132112c8b82	on	4	2025-01-29 23:42:27.309+00	2025-01-30 07:57:12.294+00
f649aa6a-bb7b-45de-bd1c-1e772b51c505	4bbef721-c967-42e9-9eb1-97d1cbfd1275	7c099cd5-039e-4f69-87f4-5f375d298776	off	1	2025-01-29 23:38:17.709+00	2025-01-31 08:30:04.738+00
d4132e5b-8f5a-49ea-a10e-21a98d21b784	4bbef721-c967-42e9-9eb1-97d1cbfd1275	67fa9a04-5086-42a7-919a-d132112c8b82	on	2	2025-01-29 23:38:12.215+00	2025-01-30 07:35:45.994+00
b10507c5-8341-4367-b5cb-927ce925145e	4bbef721-c967-42e9-9eb1-97d1cbfd1275	e7da0329-5fd9-4264-818b-653b7937b254	on	0	2025-01-29 23:38:30.514+00	2025-01-30 02:28:08.965+00
28e7481f-6355-4f3d-af83-daa9b238b753	3f64636a-ee66-44d7-9886-6ff720ff4aae	c66e7a6b-0c91-472b-b712-cb1db7a706ac	on	3	2025-01-29 23:32:24.521+00	2025-01-30 07:04:48.667+00
c9528c1e-7f5f-4450-b993-ad871f63f26b	4bbef721-c967-42e9-9eb1-97d1cbfd1275	3880a16f-830d-46d0-a41d-3d71ffc1e817	off	2	2025-01-29 23:38:23.609+00	2025-01-30 09:48:57.237+00
298f1a4f-8c97-4c91-83d7-e09e6946c9d0	c43d0330-8c54-487b-93b3-06b2a312fc04	7c099cd5-039e-4f69-87f4-5f375d298776	on	3	2025-01-29 23:42:34.51+00	2025-01-31 08:30:13.575+00
b3a58536-73ed-479d-9a15-725e6945b355	be12b143-3518-4278-adba-7b9096627c14	7c099cd5-039e-4f69-87f4-5f375d298776	off	1	2025-01-29 23:44:58.312+00	2025-01-31 08:30:13.897+00
249f1b34-74e3-4694-89f6-7fed18e3a9f0	a012999d-5fa0-47ca-ae6e-45f010fb5328	3880a16f-830d-46d0-a41d-3d71ffc1e817	on	2	2025-01-29 23:36:48.211+00	2025-01-30 09:49:11.096+00
332ef864-c4d7-4ee6-ac53-ac41a45f2eed	be12b143-3518-4278-adba-7b9096627c14	3880a16f-830d-46d0-a41d-3d71ffc1e817	off	3	2025-01-29 23:45:05.225+00	2025-01-30 09:49:11.391+00
e4805b9a-8d98-40f7-82eb-846e3e845166	be12b143-3518-4278-adba-7b9096627c14	32888420-4e27-4fa7-adb8-7918ffbe504a	on	2	2025-01-29 23:45:19.213+00	2025-01-30 12:36:25.189+00
\.


--
-- Data for Name: Usuarios; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Usuarios" (id, username, email, password, country, tipo_usuario, pontos, "createdAt", "updatedAt") FROM stdin;
12a89c7b-b032-4ab0-a9ad-e328f336642b	mtosse	mtosse@gmail.com	$2b$10$FKPwzuxwnsgdc2z7hLnPxuSnvBymgZTyeUopaU712bOTvZl2WfoF2	Austria	normal	18	2025-01-29 23:19:04.517+00	2025-01-30 12:55:43.506+00
3f64636a-ee66-44d7-9886-6ff720ff4aae	clara	clara@gmail.com	$2b$10$g.tJwbXqEKHOl5spoJgl1eHYbj5WaCsc5vHLQAYAOiJu7gOFlLZVe	China	normal	13	2025-01-29 23:17:41.005+00	2025-01-31 08:24:51.398+00
a012999d-5fa0-47ca-ae6e-45f010fb5328	jsoares	justinocsoares123@gmail.com	$2b$10$A.IYqPVhxw2zWv50Clfhr.sw8/poObRjwpD/hZfaJsePxr/OXk5oy	Angola	normal	25	2025-01-29 23:16:56.214+00	2025-01-31 08:25:21.41+00
4bbef721-c967-42e9-9eb1-97d1cbfd1275	mila	mila@gmail.com	$2b$10$oMueGWA8qe.HUmtAHz2HiOk6D498.1cLhSVAgkdE1C4DoaiarOWEC	Botswana	normal	14	2025-01-29 23:18:14.51+00	2025-01-31 08:29:19.915+00
be12b143-3518-4278-adba-7b9096627c14	tuninho	tuninho@gmail.com	$2b$10$X/g9zZrURvW013uwVF3q0OnYySu9yHXDfHM4pyaC3vCJrDp.aGSE6	Japan	normal	16	2025-01-29 23:27:15.401+00	2025-01-31 08:29:42.108+00
c43d0330-8c54-487b-93b3-06b2a312fc04	msalembe	msalembe@gmail.com	$2b$10$0w8IddpPntlmAbqOQL3iZOx7W1NlHBbARr1REgFe02ROpx.4uFk/u	Jordan	normal	25	2025-01-29 23:20:40.301+00	2025-01-31 08:30:13.476+00
abd5c5ad-79ec-4370-bf50-7f5a266304d5	mariosalembe_	mariosalembe@gmail.com	$2b$10$AM.FPHdBjgUz5WXSXTqHV.2o7vijkM.Xf/0N9vgtd7.WyeZ8/N0Iq	Cameroon	normal	0	2025-01-29 23:03:40.603+00	2025-01-29 23:03:40.603+00
\.


--
-- Name: Adversarios Adversarios_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Adversarios"
    ADD CONSTRAINT "Adversarios_pkey" PRIMARY KEY (id);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: Torneios Torneios_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Torneios"
    ADD CONSTRAINT "Torneios_pkey" PRIMARY KEY (id);


--
-- Name: UsuarioTorneios UsuarioTorneios_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."UsuarioTorneios"
    ADD CONSTRAINT "UsuarioTorneios_pkey" PRIMARY KEY (id);


--
-- Name: Usuarios Usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Usuarios"
    ADD CONSTRAINT "Usuarios_email_key" UNIQUE (email);


--
-- Name: Usuarios Usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Usuarios"
    ADD CONSTRAINT "Usuarios_pkey" PRIMARY KEY (id);


--
-- Name: Usuarios Usuarios_username_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Usuarios"
    ADD CONSTRAINT "Usuarios_username_key" UNIQUE (username);


--
-- Name: Adversarios Adversarios_jogador1Id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Adversarios"
    ADD CONSTRAINT "Adversarios_jogador1Id_fkey" FOREIGN KEY ("jogador1Id") REFERENCES public."Usuarios"(id) ON DELETE CASCADE;


--
-- Name: Adversarios Adversarios_jogador2Id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Adversarios"
    ADD CONSTRAINT "Adversarios_jogador2Id_fkey" FOREIGN KEY ("jogador2Id") REFERENCES public."Usuarios"(id) ON DELETE CASCADE;


--
-- Name: Adversarios Adversarios_torneioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Adversarios"
    ADD CONSTRAINT "Adversarios_torneioId_fkey" FOREIGN KEY ("torneioId") REFERENCES public."Torneios"(id) ON DELETE CASCADE;


--
-- Name: Torneios Torneios_usuarioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Torneios"
    ADD CONSTRAINT "Torneios_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public."Usuarios"(id);


--
-- Name: UsuarioTorneios UsuarioTorneios_torneioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."UsuarioTorneios"
    ADD CONSTRAINT "UsuarioTorneios_torneioId_fkey" FOREIGN KEY ("torneioId") REFERENCES public."Torneios"(id) ON DELETE CASCADE;


--
-- Name: UsuarioTorneios UsuarioTorneios_usuarioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."UsuarioTorneios"
    ADD CONSTRAINT "UsuarioTorneios_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public."Usuarios"(id) ON DELETE CASCADE;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

