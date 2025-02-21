PGDMP                      }            neondb    16.8    17.4 (Debian 17.4-1.pgdg120+2) *    M           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
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
��Q�["�����hi��c1��ZW���V>^�+?����B�T�'lW�+��=����{t�@ćBhȞs��ˋ�Uq�A� =+��>�WC����]	/(|��'5WvZ\�i��!HxHC[&AV0fҜ&� YO���c�����s�c�k�M��r�7{��      F   
  x�}��r�:���O��s7e�Y\ ���PS�%Y2���	����fC:��O.l��}��k���U$�o%>��Zi�;JR!1�b��lܯۿ'�̃h���"�/����w����[��؈���C����tW>,&㧃,Wz 11���xN��F�R��f���e��s�A���D�ZĪ�X���B_K�`R��h��8.�����bI�)!}F��3�W����ɽE2ק�%�������]p7XlKw��.鼊[�� G��si�j���n�:�YgX�x��v���� ,�#�7 |��"Q�(����)�! ����h_��DF�˷y������cT���q6������Fר����:܍n�[t��*��v�z�*��^��A�1Y�<`�:#F�/��Q�(E~q�D���>�h�I!�-6z��}}��@oa��U7��%��<>�d���!n��ʦ��p�:�9Dz��>`y���{�efs~΁��EEL&?�Dc��wN�1+}��1h�1��y�\g���$�����%˾�v��$y�4�;60"��ǅJ-�]�gͻ����z0����u��U@U�KW��J�Y�O��E�8��X���H�1��g3�����+*�����2�]��!Y�h��>����F#��U�����e�^wA���v�N;�A�'6xyϞ��E��x��R:Yο���Ƒ�!PҪHU�oLH���Q@Q�b"�H���	uA�G�*�uh�S���X,�Bo/F�Kқ�'��+8��=���}}68�n����ɟ�+������I���`0�⊮ф��g8���"e� �y�
�R~�H��8v�g1�PAl �c:dcͽm4M���,uv]���x,�i���c�|�Cٜ��a��=?�پZ�썈Yi��ʍhO_o��s�"���
/"(A>9�!ؕ���>s�pQ��Q�3�U��5�9@~Ʉ���/�ߘ����oc|���3"�֕���F,求C%N��BsSJj?�+���E�7[������`�k�&�ڦj��U��Q�X-�ŷ�����Y�5����q!O;d%^YO3����+�B�"p����^.�@�������̀�P�	#,����k���B�z�V/tj�%AH\�Tx#��+����!ٽO^�ȾP��]c�����{���in҉*��K����
����Hq���� �@�T���W#������8�����Fa	�n��dn�p��\�W�\�Yv�aa0~�ζ��ZM=���Ғ^�>�TJ��F��_�v�v���w1�S�"�\�gK@a����zT�}Ŝ���[;M�^��09^�.͒u�6��K��|l��������`؞�FMWY�G���辏L��s�MyQV��?�`r���"�	���+KG3�\Gx%����୔ǡ�1Q�W�����{���^�吋����-�:{��=$��}��>�:��u�+.qJR���߀.��ݛE�vDZpS��Q$�Q�$%��7L����%p�h��Z��|�:�i����tl�E�F���?��O�p�	s*�Q�b"�tB���E\��"�4�A�V�|�g�[��{�Z�O__�r0^��-T������%�Ϫ�y�}�{��w�G��}�*o{��P�rPx�#��|��H�Yʑ���ЂY��Ed��)O��+�ѐ*��6���\񤱝-^V�e�כ(�b�\]�R�*���'��ۘ�Y�^0%��Jo,�s~޸�a�Ҹ�1}S�I��%���c�`�&!�;�!�q�`l<�v�%�s�_rTG���(~�$c��~�j��P�z�.���t���;k�j���_�5��;��K�}�p���"-�����8a�7��a�p��Ѕ�a�	s�Qس��%E��6��?��A��%�����w{��ƣ�g��.a���:y�4���g��I��ǈ_K�a�b����qs���w$�����A.�1/Gr�N�7g~zs�8��%V�^�[���&�|3�Q"�{�8�ht,oh���~�H�Hc>c��a`�ž���mBц(+��9����xW�J��v�WK����F�\�j{߬�{:�d��Y�f��$X����?�cx�$��u/��ɨ����H�,#B��9�����#K@@0�0�>I'�+\.�WsO=�s��\w��Ma`��;���L��yk�y��0*m�<���N��#<�8�=*^�8�р�O3�:r$��/�<�LhZ��ؗP�4��
iN�t?ʒ��'��|zޜ�	�\\q�(�L��[��*���ʮ3�6Y�K���!/M�Ei�f�~<:L����<��&<��(��6P�CuT�X�PQ�zg0�BFuZ�6Ԝ�J��t������j��a�]V�^W�B뵍�9-�r���-z�
;,�`x;�wxx�ĕN�0\l���"��">�Y��/�R֢�K��@U0��*b���c��4�l����/�>1�� șm@��.+�<?a~�8GG�KJ"��O��Ǐ��.3�     