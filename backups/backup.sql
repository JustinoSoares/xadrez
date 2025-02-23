PGDMP  ,                    }            neondb    16.8    17.4 (Debian 17.4-1.pgdg120+2) *    M           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            N           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            O           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            P           1262    40997    neondb    DATABASE     n   CREATE DATABASE neondb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C.UTF-8';
    DROP DATABASE neondb;
                     neondb_owner    false            n           1247    41228    enum_Adversarios_status    TYPE     S   CREATE TYPE public."enum_Adversarios_status" AS ENUM (
    'open',
    'closed'
);
 ,   DROP TYPE public."enum_Adversarios_status";
       public               neondb_owner    false            \           1247    41083    enum_Teams_status    TYPE     H   CREATE TYPE public."enum_Teams_status" AS ENUM (
    'on',
    'off'
);
 &   DROP TYPE public."enum_Teams_status";
       public               neondb_owner    false            b           1247    41166    enum_Torneios_status    TYPE     p   CREATE TYPE public."enum_Torneios_status" AS ENUM (
    'open',
    'closed',
    'current',
    'cancelled'
);
 )   DROP TYPE public."enum_Torneios_status";
       public               neondb_owner    false            S           1247    41032    enum_Torneios_type    TYPE     e   CREATE TYPE public."enum_Torneios_type" AS ENUM (
    'allvsall',
    'eliminatoria',
    'teams'
);
 '   DROP TYPE public."enum_Torneios_type";
       public               neondb_owner    false            V           1247    41054    enum_UsuarioTorneios_status    TYPE     R   CREATE TYPE public."enum_UsuarioTorneios_status" AS ENUM (
    'on',
    'off'
);
 0   DROP TYPE public."enum_UsuarioTorneios_status";
       public               neondb_owner    false            Y           1247    41060    enum_UsuarioTorneios_type    TYPE     U   CREATE TYPE public."enum_UsuarioTorneios_type" AS ENUM (
    'player',
    'team'
);
 .   DROP TYPE public."enum_UsuarioTorneios_type";
       public               neondb_owner    false            P           1247    41004    enum_Usuarios_tipo_usuario    TYPE     W   CREATE TYPE public."enum_Usuarios_tipo_usuario" AS ENUM (
    'admin',
    'normal'
);
 /   DROP TYPE public."enum_Usuarios_tipo_usuario";
       public               neondb_owner    false            �            1259    41233    Adversarios    TABLE     �  CREATE TABLE public."Adversarios" (
    id uuid NOT NULL,
    "torneioId" uuid NOT NULL,
    "jogador1Id" uuid NOT NULL,
    "jogador2Id" uuid NOT NULL,
    status public."enum_Adversarios_status" NOT NULL,
    winner character varying(255) DEFAULT NULL::character varying,
    rodada integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
 !   DROP TABLE public."Adversarios";
       public         heap r       neondb_owner    false    878            �            1259    40998    SequelizeMeta    TABLE     R   CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);
 #   DROP TABLE public."SequelizeMeta";
       public         heap r       neondb_owner    false            �            1259    41189    Teams    TABLE     ]  CREATE TABLE public."Teams" (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    "usuarioId" uuid NOT NULL,
    "torneioId" uuid NOT NULL,
    status public."enum_Teams_status" DEFAULT 'on'::public."enum_Teams_status" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Teams";
       public         heap r       neondb_owner    false    860    860            �            1259    41175    Torneios    TABLE     �  CREATE TABLE public."Torneios" (
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
    DROP TABLE public."Torneios";
       public         heap r       neondb_owner    false    866    851    866    851            �            1259    41205    UsuarioTorneios    TABLE     �  CREATE TABLE public."UsuarioTorneios" (
    id uuid NOT NULL,
    "usuarioId" uuid NOT NULL,
    "torneioId" uuid NOT NULL,
    status public."enum_UsuarioTorneios_status" NOT NULL,
    type public."enum_UsuarioTorneios_type" DEFAULT 'player'::public."enum_UsuarioTorneios_type" NOT NULL,
    "teamId" uuid,
    pontos integer DEFAULT 0,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
 %   DROP TABLE public."UsuarioTorneios";
       public         heap r       neondb_owner    false    857    854    857            �            1259    41152    Usuarios    TABLE     �  CREATE TABLE public."Usuarios" (
    id uuid NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    country character varying(255) DEFAULT 'Angola'::character varying NOT NULL,
    tipo_usuario public."enum_Usuarios_tipo_usuario" NOT NULL,
    pontos integer DEFAULT 0,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    code character varying(45)
);
    DROP TABLE public."Usuarios";
       public         heap r       neondb_owner    false    848            J          0    41233    Adversarios 
   TABLE DATA           �   COPY public."Adversarios" (id, "torneioId", "jogador1Id", "jogador2Id", status, winner, rodada, "createdAt", "updatedAt") FROM stdin;
    public               neondb_owner    false    220   -;       E          0    40998    SequelizeMeta 
   TABLE DATA           /   COPY public."SequelizeMeta" (name) FROM stdin;
    public               neondb_owner    false    215   J;       H          0    41189    Teams 
   TABLE DATA           g   COPY public."Teams" (id, name, "usuarioId", "torneioId", status, "createdAt", "updatedAt") FROM stdin;
    public               neondb_owner    false    218   �;       G          0    41175    Torneios 
   TABLE DATA           u   COPY public."Torneios" (id, name, pass, date_start, "usuarioId", status, type, "createdAt", "updatedAt") FROM stdin;
    public               neondb_owner    false    217   �;       I          0    41205    UsuarioTorneios 
   TABLE DATA           �   COPY public."UsuarioTorneios" (id, "usuarioId", "torneioId", status, type, "teamId", pontos, "createdAt", "updatedAt") FROM stdin;
    public               neondb_owner    false    219   S@       F          0    41152    Usuarios 
   TABLE DATA           �   COPY public."Usuarios" (id, username, email, password, country, tipo_usuario, pontos, "createdAt", "updatedAt", code) FROM stdin;
    public               neondb_owner    false    216   VA       �           2606    41239    Adversarios Adversarios_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public."Adversarios"
    ADD CONSTRAINT "Adversarios_pkey" PRIMARY KEY (id);
 J   ALTER TABLE ONLY public."Adversarios" DROP CONSTRAINT "Adversarios_pkey";
       public                 neondb_owner    false    220            �           2606    41002     SequelizeMeta SequelizeMeta_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);
 N   ALTER TABLE ONLY public."SequelizeMeta" DROP CONSTRAINT "SequelizeMeta_pkey";
       public                 neondb_owner    false    215            �           2606    41194    Teams Teams_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public."Teams"
    ADD CONSTRAINT "Teams_pkey" PRIMARY KEY (id);
 >   ALTER TABLE ONLY public."Teams" DROP CONSTRAINT "Teams_pkey";
       public                 neondb_owner    false    218            �           2606    41183    Torneios Torneios_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."Torneios"
    ADD CONSTRAINT "Torneios_pkey" PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."Torneios" DROP CONSTRAINT "Torneios_pkey";
       public                 neondb_owner    false    217            �           2606    41211 $   UsuarioTorneios UsuarioTorneios_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public."UsuarioTorneios"
    ADD CONSTRAINT "UsuarioTorneios_pkey" PRIMARY KEY (id);
 R   ALTER TABLE ONLY public."UsuarioTorneios" DROP CONSTRAINT "UsuarioTorneios_pkey";
       public                 neondb_owner    false    219            �           2606    41164    Usuarios Usuarios_email_key 
   CONSTRAINT     [   ALTER TABLE ONLY public."Usuarios"
    ADD CONSTRAINT "Usuarios_email_key" UNIQUE (email);
 I   ALTER TABLE ONLY public."Usuarios" DROP CONSTRAINT "Usuarios_email_key";
       public                 neondb_owner    false    216            �           2606    41160    Usuarios Usuarios_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."Usuarios"
    ADD CONSTRAINT "Usuarios_pkey" PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."Usuarios" DROP CONSTRAINT "Usuarios_pkey";
       public                 neondb_owner    false    216            �           2606    41162    Usuarios Usuarios_username_key 
   CONSTRAINT     a   ALTER TABLE ONLY public."Usuarios"
    ADD CONSTRAINT "Usuarios_username_key" UNIQUE (username);
 L   ALTER TABLE ONLY public."Usuarios" DROP CONSTRAINT "Usuarios_username_key";
       public                 neondb_owner    false    216            �           2606    41245 '   Adversarios Adversarios_jogador1Id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Adversarios"
    ADD CONSTRAINT "Adversarios_jogador1Id_fkey" FOREIGN KEY ("jogador1Id") REFERENCES public."Usuarios"(id) ON DELETE CASCADE;
 U   ALTER TABLE ONLY public."Adversarios" DROP CONSTRAINT "Adversarios_jogador1Id_fkey";
       public               neondb_owner    false    216    3234    220            �           2606    41250 '   Adversarios Adversarios_jogador2Id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Adversarios"
    ADD CONSTRAINT "Adversarios_jogador2Id_fkey" FOREIGN KEY ("jogador2Id") REFERENCES public."Usuarios"(id) ON DELETE CASCADE;
 U   ALTER TABLE ONLY public."Adversarios" DROP CONSTRAINT "Adversarios_jogador2Id_fkey";
       public               neondb_owner    false    220    216    3234            �           2606    41240 &   Adversarios Adversarios_torneioId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Adversarios"
    ADD CONSTRAINT "Adversarios_torneioId_fkey" FOREIGN KEY ("torneioId") REFERENCES public."Torneios"(id) ON DELETE CASCADE;
 T   ALTER TABLE ONLY public."Adversarios" DROP CONSTRAINT "Adversarios_torneioId_fkey";
       public               neondb_owner    false    3238    220    217            �           2606    41200    Teams Teams_torneioId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Teams"
    ADD CONSTRAINT "Teams_torneioId_fkey" FOREIGN KEY ("torneioId") REFERENCES public."Torneios"(id);
 H   ALTER TABLE ONLY public."Teams" DROP CONSTRAINT "Teams_torneioId_fkey";
       public               neondb_owner    false    217    218    3238            �           2606    41195    Teams Teams_usuarioId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Teams"
    ADD CONSTRAINT "Teams_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public."Usuarios"(id);
 H   ALTER TABLE ONLY public."Teams" DROP CONSTRAINT "Teams_usuarioId_fkey";
       public               neondb_owner    false    218    3234    216            �           2606    41184     Torneios Torneios_usuarioId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Torneios"
    ADD CONSTRAINT "Torneios_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public."Usuarios"(id);
 N   ALTER TABLE ONLY public."Torneios" DROP CONSTRAINT "Torneios_usuarioId_fkey";
       public               neondb_owner    false    217    216    3234            �           2606    41222 +   UsuarioTorneios UsuarioTorneios_teamId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."UsuarioTorneios"
    ADD CONSTRAINT "UsuarioTorneios_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES public."Teams"(id) ON DELETE CASCADE;
 Y   ALTER TABLE ONLY public."UsuarioTorneios" DROP CONSTRAINT "UsuarioTorneios_teamId_fkey";
       public               neondb_owner    false    3240    219    218            �           2606    41217 .   UsuarioTorneios UsuarioTorneios_torneioId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."UsuarioTorneios"
    ADD CONSTRAINT "UsuarioTorneios_torneioId_fkey" FOREIGN KEY ("torneioId") REFERENCES public."Torneios"(id) ON DELETE CASCADE;
 \   ALTER TABLE ONLY public."UsuarioTorneios" DROP CONSTRAINT "UsuarioTorneios_torneioId_fkey";
       public               neondb_owner    false    219    217    3238            �           2606    41212 .   UsuarioTorneios UsuarioTorneios_usuarioId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."UsuarioTorneios"
    ADD CONSTRAINT "UsuarioTorneios_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public."Usuarios"(id) ON DELETE CASCADE;
 \   ALTER TABLE ONLY public."UsuarioTorneios" DROP CONSTRAINT "UsuarioTorneios_usuarioId_fkey";
       public               neondb_owner    false    219    216    3234                       826    49153     DEFAULT PRIVILEGES FOR SEQUENCES    DEFAULT ACL     {   ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;
          public               cloud_admin    false                       826    49152    DEFAULT PRIVILEGES FOR TABLES    DEFAULT ACL     �   ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO neon_superuser WITH GRANT OPTION;
          public               cloud_admin    false            J      x������ � �      E   ]   x�u�A
� @���E�����Fj%�h�	����G�ޢq�|�f��I)�פ7|���
r�Z��T��˧���3��*��I,�}n����24      H      x������ � �      G   o  x���IO#I�����9��:��73�P�k.�������_?Y����R_R%�_����%�$� �4I�P ��&�Y�L��ЙK�6�[�~`���]�C<_���f�vR�#?�_o�l��O������t�������"*a��aTA�Ja¿!,qh���0��h��� �3�,�K���|��	�k' � X%�J`�*�}_*K�����y�*nS�j#�J�Fy�>͜���`;�w�k�����I[]�c�ު�_���V�_��u�oavq!���V��R�
+�P+<PH*���������x��*����W�ג�BaA�a%c�QPb��A ��@P�a��JC=��+��|}�m7��g8�߮rt�烋������/cw<�t��g�����O�UC��yg��-d��'y�U� � �
*�Z'5ÉR�@�.�@YtB4b�#�R�2��`ʃua@i�I�k���m~BΞ&Cs)��*I��'jy���v�m���nԙ'v����Q	q�U��>�(��SȡV��#O�B`ċR�S-��[� 0���e��&Pkܼ�|�W�����T�-�UO6����m��w{v�]-jj�����r>�ӝ���h���ݛ�HT��bt�uL$0��I��iq��)�y���3o�+�W!�f���)V�-�96�� ��
�`PXlp4���pƖ�~��'�^B��y���8<��x����q�z��a�p��,�c9��E�J�=�#�Aא ������~�.�Lo�u�?���~�E쓺�JC&�H�u����^u2��P�	�L$���m�i�?��mN���äW_�X/��"�1�<F�=���h�ܮV����;K��rc�<�Ù�����F^*� 2��	�PB�b�6X9A_��%3�� o��a�����y5,���	%�)����&D#��!AB��Q�ubAz���}a(f�ɰam4�ˉ���v��4=&�n~���AG4�v�=������e@Ӣ	��o��T6NX�`+oiHi� I�	�g2�
d������&�f�j?�b�ƭu׻�ุ۵Q:՗O�p��q�tk�w�Ӱ?��D�K�R�ߨ\.��5�      I   �   x���;ND1��:w�ȣ�;�E��i�ĩ :vϥA#���S|GyL�M�6'����a%y�N��[EY2UAd�9�
��Q�["�����hi��c1��ZW���V>^�+?����B�T�'lW�+��=����{t�@ćBhȞs��ˋ�Uq�A� =+��>�WC����]	/(|��'5WvZ\�i��!HxHC[&AV0fҜ&� YO���c�����s�c�k�M��r�7{��      F   
  x�}X�v�:�|Ew��FoY�HxB �^�,ɒ�L �՟�?�r�s���mY$���U���U$�o%>��Zi�;JR!1�b��lܯۿ'�̃h���"�/����w����[��؈���C����tW>,&㧃,Wz 11���xN��F�R��f���e��s�A���D�ZĪ�X���B_S�`R��h��8N�����bI�)!}F��3�W����ɽE2ק�%�e+w�a)\��n�ؖ���]�y�L��������Vq��.u��ΰZ�����M���sa|�oPX$
�
�_ �������� ����h_��DF�Ƿy������ƨ0Q��l�����s��Q'}9�su���w-�:�
�U���*��~UxM���q���"�C�A0`�1j��#�|�5�G�M1�#ļ�F��¸��K�-lX�����d֝���;{9���]ٔz�U'5�H���,��r����o���@E�zEEL&?�Dc��wN�1+}��1p�1��y�\g���$�����˾�v��$y�4�;60"��ǅJ-�]�gͻ����z0����u��U�U��W��J⿱��̋�9pHa�6Ě#��Tr�E��:V�ג3�p����N��4v��C��%�v�}��5�F�����S����0�� ����v��Ol��=c+�t{�P{�t����_G�@I�"UAH�aB�T���� ��&"�D�H�p`T{��"_��:���Œ,�6�p0Io>F��W���<[���������V:&n�\n˷�NG$�σ�lp�+�Fڪ�����(RrQT�/<R�@)�A���YL(T��؄�XsoMm�w:K�]FW�f#iZ���X=z�P6��`v�=d�Ol���;{#bV��r#����9ǁ�q�"���
^D"P�|�0\� W����E�WZ�EE$6FQΈWYZ�\� ��H&�^�>^��a:[��������2"_֕���F,求M%N����)%�r��m�Л-S���z���5Y�YmS�B�*i��(w����r�~htĬ���W�򸐍������N�K�+�B�"P����^N�"I���U1��k��	#,����k���B�z�V/tj�%AH\���FV�Wn��C�{���,�}�ʃ���<[������ܤUZ����� ��"�E,���)� R�"��}E�,��N�iq�"�dp�%|n��dn�p��\�W|��,;Ͱ0��
g[�v����}�Ti�/wZ*��E�_Տ/w�i�\���;����D�>������p0����j_1'}~rk�)bԫ�0L�שK�d��'�LW>6r�D�����i0lOj�������t]bt�G�`�9�ۦ�(����`r���"�	�ɕ���j��	F)0C����8�8&�|y�ϯ�����rzx}�C.����dX�t�A6\��H���}6+t,��V�\,*┤BE���:�7�B��*���*��Q$�Q�$%��7L����%p�h��Z�]|�:�i���t4�"R���c�W��'_8ф9�(�e1A:!Y`�"�\`C��r��4_���y�V����]Ƌ����a{�`6b��d�Y�>O�ow|�n����[��co�6ԡ���C
��`D�A:�:)�e�r�(�2,�Eȏ!QD�*.���k�r�ºl�L?��&��l�"/���Dy���j�zT�e<9T��t�*��)��UzcY蟣���uC(�����M�'�-q�X�Cp���	�Ԩ�)q�+�� �ƳnYb>��%��h4����c̡��/[�0jW���v՛xg�^m���Kݶ�ù_rɴ/ �Z]�%x-���!�f}Jh�g.]����w�=��_�h�]׆�U��^0hԓ�d����n�u�x���lr�%��}['o������ Fp��1���s��g/$%F�@j���I���o$u�ˡ͋@����͙��@=c����!�F��4�@y��"�9�,8�X��	�i�@g,=t���PҾ��(�e%�>ۛ?��jQ)y܎�jiZ~Q���(��Sm�U8��K��`��N�Ei[���>�G�@b`!�{�OBE@�'Gbgy���AG Fr��,A�ü�$�x�p�\�]�=���5hKs�m�7��	��@��O3In�y�U�¨��o�x?;qƎ���Lרhx�� �}�)֑#QD|��1d�i)�c_B��;C(�9���(KV۟,�4ޜƄp.�(Po&���V-��ʭᥲ�L��BVz��=��K�xQwǇY���s�g;O��	ϩ%�ׄ����5�ta�?T��O��ZQȨN+߆��X)����.�S:Z��\m^;L��ja���Uh���<��]ns�`�EoVa�Eo�]�c���������_��"#V�8P\��9��R֢�!@�`�*�_|1쇆R�1UZo�Y����ECL�; r&�e�e%�WvX���Ӓ��eJ��O��Ǐ��3�     