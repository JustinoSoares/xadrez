PGDMP      :                }            neondb    16.8    16.8 (Debian 16.8-1.pgdg120+1) *    M           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            N           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            O           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            P           1262    40997    neondb    DATABASE     n   CREATE DATABASE neondb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C.UTF-8';
    DROP DATABASE neondb;
                neondb_owner    false            n           1247    41228    enum_Adversarios_status    TYPE     S   CREATE TYPE public."enum_Adversarios_status" AS ENUM (
    'open',
    'closed'
);
 ,   DROP TYPE public."enum_Adversarios_status";
       public          neondb_owner    false            \           1247    41083    enum_Teams_status    TYPE     H   CREATE TYPE public."enum_Teams_status" AS ENUM (
    'on',
    'off'
);
 &   DROP TYPE public."enum_Teams_status";
       public          neondb_owner    false            b           1247    41166    enum_Torneios_status    TYPE     p   CREATE TYPE public."enum_Torneios_status" AS ENUM (
    'open',
    'closed',
    'current',
    'cancelled'
);
 )   DROP TYPE public."enum_Torneios_status";
       public          neondb_owner    false            S           1247    41032    enum_Torneios_type    TYPE     e   CREATE TYPE public."enum_Torneios_type" AS ENUM (
    'allvsall',
    'eliminatoria',
    'teams'
);
 '   DROP TYPE public."enum_Torneios_type";
       public          neondb_owner    false            V           1247    41054    enum_UsuarioTorneios_status    TYPE     R   CREATE TYPE public."enum_UsuarioTorneios_status" AS ENUM (
    'on',
    'off'
);
 0   DROP TYPE public."enum_UsuarioTorneios_status";
       public          neondb_owner    false            Y           1247    41060    enum_UsuarioTorneios_type    TYPE     U   CREATE TYPE public."enum_UsuarioTorneios_type" AS ENUM (
    'player',
    'team'
);
 .   DROP TYPE public."enum_UsuarioTorneios_type";
       public          neondb_owner    false            P           1247    41004    enum_Usuarios_tipo_usuario    TYPE     W   CREATE TYPE public."enum_Usuarios_tipo_usuario" AS ENUM (
    'admin',
    'normal'
);
 /   DROP TYPE public."enum_Usuarios_tipo_usuario";
       public          neondb_owner    false            �            1259    41233    Adversarios    TABLE     �  CREATE TABLE public."Adversarios" (
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
       public         heap    neondb_owner    false    878            �            1259    40998    SequelizeMeta    TABLE     R   CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);
 #   DROP TABLE public."SequelizeMeta";
       public         heap    neondb_owner    false            �            1259    41189    Teams    TABLE     ]  CREATE TABLE public."Teams" (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    "usuarioId" uuid NOT NULL,
    "torneioId" uuid NOT NULL,
    status public."enum_Teams_status" DEFAULT 'on'::public."enum_Teams_status" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Teams";
       public         heap    neondb_owner    false    860    860            �            1259    41175    Torneios    TABLE     �  CREATE TABLE public."Torneios" (
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
       public         heap    neondb_owner    false    866    851    866    851            �            1259    41205    UsuarioTorneios    TABLE     �  CREATE TABLE public."UsuarioTorneios" (
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
       public         heap    neondb_owner    false    857    854    857            �            1259    41152    Usuarios    TABLE     �  CREATE TABLE public."Usuarios" (
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
       public         heap    neondb_owner    false    848            J          0    41233    Adversarios 
   TABLE DATA           �   COPY public."Adversarios" (id, "torneioId", "jogador1Id", "jogador2Id", status, winner, rodada, "createdAt", "updatedAt") FROM stdin;
    public          neondb_owner    false    220   ':       E          0    40998    SequelizeMeta 
   TABLE DATA           /   COPY public."SequelizeMeta" (name) FROM stdin;
    public          neondb_owner    false    215   R;       H          0    41189    Teams 
   TABLE DATA           g   COPY public."Teams" (id, name, "usuarioId", "torneioId", status, "createdAt", "updatedAt") FROM stdin;
    public          neondb_owner    false    218   �;       G          0    41175    Torneios 
   TABLE DATA           u   COPY public."Torneios" (id, name, pass, date_start, "usuarioId", status, type, "createdAt", "updatedAt") FROM stdin;
    public          neondb_owner    false    217   �;       I          0    41205    UsuarioTorneios 
   TABLE DATA           �   COPY public."UsuarioTorneios" (id, "usuarioId", "torneioId", status, type, "teamId", pontos, "createdAt", "updatedAt") FROM stdin;
    public          neondb_owner    false    219   U@       F          0    41152    Usuarios 
   TABLE DATA           �   COPY public."Usuarios" (id, username, email, password, country, tipo_usuario, pontos, "createdAt", "updatedAt", code) FROM stdin;
    public          neondb_owner    false    216   B       �           2606    41239    Adversarios Adversarios_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public."Adversarios"
    ADD CONSTRAINT "Adversarios_pkey" PRIMARY KEY (id);
 J   ALTER TABLE ONLY public."Adversarios" DROP CONSTRAINT "Adversarios_pkey";
       public            neondb_owner    false    220            �           2606    41002     SequelizeMeta SequelizeMeta_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);
 N   ALTER TABLE ONLY public."SequelizeMeta" DROP CONSTRAINT "SequelizeMeta_pkey";
       public            neondb_owner    false    215            �           2606    41194    Teams Teams_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public."Teams"
    ADD CONSTRAINT "Teams_pkey" PRIMARY KEY (id);
 >   ALTER TABLE ONLY public."Teams" DROP CONSTRAINT "Teams_pkey";
       public            neondb_owner    false    218            �           2606    41183    Torneios Torneios_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."Torneios"
    ADD CONSTRAINT "Torneios_pkey" PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."Torneios" DROP CONSTRAINT "Torneios_pkey";
       public            neondb_owner    false    217            �           2606    41211 $   UsuarioTorneios UsuarioTorneios_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public."UsuarioTorneios"
    ADD CONSTRAINT "UsuarioTorneios_pkey" PRIMARY KEY (id);
 R   ALTER TABLE ONLY public."UsuarioTorneios" DROP CONSTRAINT "UsuarioTorneios_pkey";
       public            neondb_owner    false    219            �           2606    41164    Usuarios Usuarios_email_key 
   CONSTRAINT     [   ALTER TABLE ONLY public."Usuarios"
    ADD CONSTRAINT "Usuarios_email_key" UNIQUE (email);
 I   ALTER TABLE ONLY public."Usuarios" DROP CONSTRAINT "Usuarios_email_key";
       public            neondb_owner    false    216            �           2606    41160    Usuarios Usuarios_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."Usuarios"
    ADD CONSTRAINT "Usuarios_pkey" PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."Usuarios" DROP CONSTRAINT "Usuarios_pkey";
       public            neondb_owner    false    216            �           2606    41162    Usuarios Usuarios_username_key 
   CONSTRAINT     a   ALTER TABLE ONLY public."Usuarios"
    ADD CONSTRAINT "Usuarios_username_key" UNIQUE (username);
 L   ALTER TABLE ONLY public."Usuarios" DROP CONSTRAINT "Usuarios_username_key";
       public            neondb_owner    false    216            �           2606    41245 '   Adversarios Adversarios_jogador1Id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Adversarios"
    ADD CONSTRAINT "Adversarios_jogador1Id_fkey" FOREIGN KEY ("jogador1Id") REFERENCES public."Usuarios"(id) ON DELETE CASCADE;
 U   ALTER TABLE ONLY public."Adversarios" DROP CONSTRAINT "Adversarios_jogador1Id_fkey";
       public          neondb_owner    false    216    3234    220            �           2606    41250 '   Adversarios Adversarios_jogador2Id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Adversarios"
    ADD CONSTRAINT "Adversarios_jogador2Id_fkey" FOREIGN KEY ("jogador2Id") REFERENCES public."Usuarios"(id) ON DELETE CASCADE;
 U   ALTER TABLE ONLY public."Adversarios" DROP CONSTRAINT "Adversarios_jogador2Id_fkey";
       public          neondb_owner    false    220    216    3234            �           2606    41240 &   Adversarios Adversarios_torneioId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Adversarios"
    ADD CONSTRAINT "Adversarios_torneioId_fkey" FOREIGN KEY ("torneioId") REFERENCES public."Torneios"(id) ON DELETE CASCADE;
 T   ALTER TABLE ONLY public."Adversarios" DROP CONSTRAINT "Adversarios_torneioId_fkey";
       public          neondb_owner    false    3238    220    217            �           2606    41200    Teams Teams_torneioId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Teams"
    ADD CONSTRAINT "Teams_torneioId_fkey" FOREIGN KEY ("torneioId") REFERENCES public."Torneios"(id);
 H   ALTER TABLE ONLY public."Teams" DROP CONSTRAINT "Teams_torneioId_fkey";
       public          neondb_owner    false    217    218    3238            �           2606    41195    Teams Teams_usuarioId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Teams"
    ADD CONSTRAINT "Teams_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public."Usuarios"(id);
 H   ALTER TABLE ONLY public."Teams" DROP CONSTRAINT "Teams_usuarioId_fkey";
       public          neondb_owner    false    218    3234    216            �           2606    41184     Torneios Torneios_usuarioId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Torneios"
    ADD CONSTRAINT "Torneios_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public."Usuarios"(id);
 N   ALTER TABLE ONLY public."Torneios" DROP CONSTRAINT "Torneios_usuarioId_fkey";
       public          neondb_owner    false    217    216    3234            �           2606    41222 +   UsuarioTorneios UsuarioTorneios_teamId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."UsuarioTorneios"
    ADD CONSTRAINT "UsuarioTorneios_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES public."Teams"(id) ON DELETE CASCADE;
 Y   ALTER TABLE ONLY public."UsuarioTorneios" DROP CONSTRAINT "UsuarioTorneios_teamId_fkey";
       public          neondb_owner    false    3240    219    218            �           2606    41217 .   UsuarioTorneios UsuarioTorneios_torneioId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."UsuarioTorneios"
    ADD CONSTRAINT "UsuarioTorneios_torneioId_fkey" FOREIGN KEY ("torneioId") REFERENCES public."Torneios"(id) ON DELETE CASCADE;
 \   ALTER TABLE ONLY public."UsuarioTorneios" DROP CONSTRAINT "UsuarioTorneios_torneioId_fkey";
       public          neondb_owner    false    219    217    3238            �           2606    41212 .   UsuarioTorneios UsuarioTorneios_usuarioId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."UsuarioTorneios"
    ADD CONSTRAINT "UsuarioTorneios_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public."Usuarios"(id) ON DELETE CASCADE;
 \   ALTER TABLE ONLY public."UsuarioTorneios" DROP CONSTRAINT "UsuarioTorneios_usuarioId_fkey";
       public          neondb_owner    false    219    216    3234                       826    49153     DEFAULT PRIVILEGES FOR SEQUENCES    DEFAULT ACL     {   ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;
          public          cloud_admin    false                       826    49152    DEFAULT PRIVILEGES FOR TABLES    DEFAULT ACL     x   ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;
          public          cloud_admin    false            J     x�m��J�1�ם�p/�IҴMg��gp�$-����oU�Y�U�\�;&��� �F 2;�P����E=rI�������A�����f-�S^Uj��u7�ήZ���ג1f�h��%��D�.j9G��G���6_�?���p�^�?�(1rd`�#9K9�|���T��}K'f��p�� �t���#pTa,i��:��:nS����Uw��Tx��gG�z߀���+�R���ug�b	K�i�Vd.�JB����׏����;�s�gң�z�'�9�o���t:}1�od      E   ]   x�u�A
� @���E�����Fj%�h�	����G�ޢq�|�f��I)�פ7|���
r�Z��T��˧���3��*��I,�}n����24      H      x������ � �      G   i  x���Io"I���+8�4�QV�pÃ�f�6�Kneʆ*V���ɲ��ۇ��RBzR��2�Hk�$1$�0E� %�*��f�*S�,t��M���@��q7�؝��/Pu�;;�����o��г����S��S�������tZD1�8�J��),C�7�� �p�T�0��U�D�z�!��l�ӂ�ϟ6���%˄�	� T�������;� �[@��@��4��6�@�da��fI�t	�a�q����1��Uޝ�T�����Y-{쯵b��sZ���F�´V���mKH��x�A��	�($�{ʉ���o`s%^���i$)��u��EX�gX�Xl���bH� Tze�B��P�����h��ϸ����g�U���rP��z��\�ˮ;W�����㓟f����˫՛����z��WY���+����
8���2��pQ	�\	ш����FE˔#�k�)�a��]�'f�k�	D��O��9�O��#��:NZG�'jy�������hf�7��j�a�w�˓�V����6"Gf�O!%�"�?�2)z�%�ڂ�j�%BC���R�j�C�שO�R�=�����B]�dík?���ݫ����zQQ�f�x@����Ow�ҝF��x����E��T�3�s�`"��4�Lz��HC�c�(-L�γ�w�qs��f\�,����2b$�ł��D����T�r0(�k4���p��~��g�^L��e�j=qx<���h7��������a��ˋ�e�}Q3��<��[C�P�;����y�HR��։�`�������E�LC%�H�w����^w2���왈Y���l�4{��ۜ�g��W]��^Ο�EWv��):�t���G��v�:m'��E҆�Q��`?|�f��K�a�y��L�PW��@C	���Q�`�}	��H���y	���V%���B��^��FIdr�`84�	�C3zH��6v�}]X�����;�O#�C}2�[=��r"S����0INq��ߢ�ap%i��^X<���m�/���J$������h����U��P�0�h��dx	d���u��ƃF�+?����uۻ�സ�5�Q�0�.���p���~�ts�w�۰?��D
�K�Q�ߨX,�15�      I   �  x���An!����Ⱦ��6��s�� 0xU�Uw�})�������>�ۚi0)HV�9�FmlY[;�"$J%�f���І��r�#�XI�7u!+��(���k���������s�8�?x0rd@}b�D���S��=xe6�	������@g*Gj�}ћodΔm�ۇ�	kTYi�H�X�MW��}���QaD�5L�?2S{"�*_(gazk~���d�G��Z�2+H�m�}'Uv�Z?J�h�k���l�f
��˘)}?L���X|�<|M�?�1Ɯm�xo�_0�'�Kn�Y껜��䒺�Y��fM\Ғ�Y sû{@��[G�|��8��[B`������?�3��+�]�NR���o�r�5v�[�r��p�8�2vE���Y���� ����ڞU�4�C9n��Z~�ƛ���|</t�      F   �	  x�}X�r�:}���<��)�e�4@ ��K BM�.ɒ�L �5�0?6�� '��&AKZ�zu0ѡ�����g� _+m}GIS*#ƛo����=��dD���1a�W������^���F�MN���.���~>=�]��}��i?nG32�5���&K��.���y8�"�G�'��"VE����
Qt�I��"�G��O�3�Œ`?RB��8�+g���ő�-&�{�d���9�E3w7�R�r�m�)ݾ�ۤ�"��
�OzO���
�^�Dg�A�����N� `��"> � _��H�� �������� ����h_��DF��7y�����|cX��Q��n����FW��>�{������&[�u�n+��z�^Ux���q���"�C�A0`~����R�g>�T��#a����b�|�gnn���9�֭]v��l^2���=MF����lJ�w��C��^���^
��Xd��Oq�"C����"���l�6Ě#��Tr�E��:V�ג3�p����N7�4v��C��&�f�}�=5����������� �l� �Ͳ����m���=a+��t��@{�t��}L~l���^HU�*)��	B�!��� ��H#�"�'n2$�P��CK����%s�I�ڋ�z������`��g���f���N�&��ɟZK������I��S�?�_㊮ф6oN�`z�G)���� ���G�i�9Ȗ�>�	�QH�8�M萍5�6�$���,uv]��Z<Ҵ`�nb���٘��~z�==��ZnY�����hG_��>Ł����8x�@	��pB���:�31_i��Hl�����������7�Lx����P�t��?ߍ���lD(�����E,求C%N��BAPJj?�+���E�7]����x~��%Y�im]�B��*���(w�m��r����Ŵ��̖�򨐍&m�{��'�N�s�]a^��25�v��!@ P$�0p�*F>3@x-<a�%s�!�ym��_H^/��Nm� �s0^�j���u���O�o��r��'T�[�"|��˷�||{��t�J+��xz6� D\aT���E��w � E*I��U��"���&@Td�P#������u���f��uz�6��d����k�lsת��S�+M����}S��3������v;i�o�ӄ�Nf|�"@���$(�#�Yy��#�B�+�Ϗ�i��n�Ƈq��,Y�n�	:ӑ�?��e�xy�Z�ڰ�*��p5Y����)�QN�)������3L��k\D2 �+�:��֠:��� `��JbH��R��D������)��⹁��_�䀋����,��m��u��'��=��.:�U�	+?'��8�ƃP�o��C ��(��Bj�"�E"�HRB�0y�d6����k�Z�$�������Ux�..�H^!Ydp�*`�� ���aGX~�M�S��B�8�P;����d%7XN�e�io�'oyj�>�>?�`4�������Cv�K&�Vof������ތ6��]��y��Һ�w��5�s����H���"Yf)G��"(TFC	f�cp���K�<��/�Z���.[/��%��I#;�?/��t��Q��䩺�&���E<�W^Gt�*7S�tG��;E�O�(CA..|p�}���G����1�=Y݃O����Z;���kϺ-x���s��pv7���Iۘ}s�[4�a ����6���d����wk����ol�_ݟV�@Ι�����Ri	��vlcp��Y߄ Ù�Cb���*bO��s��ؐ������$(����ݮ�m��d�5�	�u^Wɫ��z:?EqB ��껍����΄}�Rb�	�n�K�U:�`T}#�c�Bk�"9p�٫3���8ԌV�^蛇��&?h>���@��D|(j��P����
L�����tƂЇ�1�b_CJ�6�hC����l	~�G9�֢R���Ҥ��:��a WA���5�pO��,�6j�����Ҧ��}��B ·�E��<
}����aD�;,�q��:�DP̼�${/0������B�����4Z�B�y�/��ǩ$׳��"EaXZ�5x����8aGxBq&{T4�@q G�>�TEܿ�����@�n�i��Ps+e�D{��";��ŏ��������ݎΛ��K�rZ��6�u6�w���'��z�1n?r9\C:��_O�o�0Ċ��N�� 
֑#QD|���/C�U�Ǿ)�v�P0�z�{Q�,7�9���z}\¹� �Q���w���*7��ʮ=�6
Y�Cw��>/��yi����^<�O~.�$�Н��Y����|�	e-:�,��z_E����rL��ƛ�:%�П�}�	�����	������-1��!&�CJ"��� ��w�.�RX���1t_�X�t�K�+��?����ݵV���$�G�U�Fdw��P�Ťc��q[�^��Y`6m���x�j��:�i����h&ؗ��'�����/3F     