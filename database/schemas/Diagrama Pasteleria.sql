CREATE TABLE "users" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "email" varchar(255) UNIQUE NOT NULL,
  "password_hash" varchar(255) NOT NULL,
  "first_name" varchar(100) NOT NULL,
  "last_name" varchar(100) NOT NULL,
  "phone" varchar(20),
  "role" varchar(20) NOT NULL,
  "is_active" boolean DEFAULT true,
  "created_at" timestamptz DEFAULT (CURRENT_TIMESTAMP),
  "updated_at" timestamptz DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "addresses" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "user_id" uuid,
  "street" varchar(255) NOT NULL,
  "city" varchar(100) NOT NULL,
  "department" varchar(100) DEFAULT 'Quindío',
  "postal_code" varchar(10),
  "latitude" decimal(10,8),
  "longitude" decimal(11,8),
  "is_default" boolean DEFAULT false,
  "created_at" timestamptz DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "categories" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "name" varchar(100) UNIQUE NOT NULL,
  "description" text,
  "is_active" boolean DEFAULT true,
  "created_at" timestamptz DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "products" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "category_id" uuid,
  "name" varchar(200) NOT NULL,
  "description" text,
  "base_price" decimal(10,2) NOT NULL,
  "preparation_time_hours" integer NOT NULL DEFAULT 24,
  "image_url" varchar(500),
  "is_customizable" boolean DEFAULT false,
  "is_active" boolean DEFAULT true,
  "is_featured" boolean DEFAULT false,
  "created_at" timestamptz DEFAULT (CURRENT_TIMESTAMP),
  "updated_at" timestamptz DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "ingredients" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "name" varchar(200) UNIQUE NOT NULL,
  "unit_of_measure" varchar(20) NOT NULL,
  "cost_per_unit" decimal(10,2) NOT NULL,
  "current_stock" decimal(10,3) NOT NULL DEFAULT 0,
  "minimum_stock" decimal(10,3) NOT NULL DEFAULT 0,
  "supplier" varchar(200),
  "expiry_date" date,
  "created_at" timestamptz DEFAULT (CURRENT_TIMESTAMP),
  "updated_at" timestamptz DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "product_ingredients" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "product_id" uuid,
  "ingredient_id" uuid,
  "quantity_needed" decimal(10,3) NOT NULL
);

CREATE TABLE "orders" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "customer_id" uuid,
  "delivery_address_id" uuid,
  "order_number" varchar(50) UNIQUE NOT NULL,
  "status" varchar(30) NOT NULL DEFAULT 'pendiente',
  "delivery_type" varchar(20) NOT NULL,
  "delivery_date" date NOT NULL,
  "delivery_time_slot" varchar(20),
  "subtotal" decimal(10,2) NOT NULL,
  "delivery_fee" decimal(10,2) DEFAULT 0,
  "total" decimal(10,2) NOT NULL,
  "special_instructions" text,
  "payment_status" varchar(20) DEFAULT 'pendiente',
  "payment_method" varchar(30),
  "created_at" timestamptz DEFAULT (CURRENT_TIMESTAMP),
  "updated_at" timestamptz DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "order_items" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "order_id" uuid,
  "product_id" uuid,
  "quantity" integer NOT NULL,
  "unit_price" decimal(10,2) NOT NULL,
  "customization_details" jsonb,
  "customization_fee" decimal(10,2) DEFAULT 0,
  "subtotal" decimal(10,2) NOT NULL
);

CREATE TABLE "order_tracking" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "order_id" uuid,
  "status" varchar(30) NOT NULL,
  "description" text,
  "latitude" decimal(10,8),
  "longitude" decimal(11,8),
  "worker_id" uuid,
  "created_at" timestamptz DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "inventory_movements" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "ingredient_id" uuid,
  "movement_type" varchar(20) NOT NULL,
  "quantity" decimal(10,3) NOT NULL,
  "reference_id" uuid,
  "reference_type" varchar(20),
  "description" text,
  "performed_by" uuid,
  "created_at" timestamptz DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "stock_alerts" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "ingredient_id" uuid,
  "alert_type" varchar(20) NOT NULL,
  "current_stock" decimal(10,3) NOT NULL,
  "minimum_stock" decimal(10,3) NOT NULL,
  "is_resolved" boolean DEFAULT false,
  "resolved_at" timestamptz,
  "resolved_by" uuid,
  "created_at" timestamptz DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "menus" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "name" varchar(200) NOT NULL,
  "description" text,
  "start_date" date NOT NULL,
  "end_date" date NOT NULL,
  "is_active" boolean DEFAULT true,
  "created_by" uuid,
  "created_at" timestamptz DEFAULT (CURRENT_TIMESTAMP),
  "updated_at" timestamptz DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "menu_products" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "menu_id" uuid,
  "product_id" uuid,
  "display_order" integer DEFAULT 0,
  "special_price" decimal(10,2),
  "max_daily_quantity" integer,
  "is_featured_in_menu" boolean DEFAULT false,
  "added_at" timestamptz DEFAULT (CURRENT_TIMESTAMP)
);

CREATE UNIQUE INDEX ON "product_ingredients" ("product_id", "ingredient_id");

CREATE UNIQUE INDEX ON "menu_products" ("menu_id", "product_id");

COMMENT ON TABLE "users" IS 'Usuarios del sistema: clientes, workers, gerentes, admin';

COMMENT ON COLUMN "users"."role" IS 'cliente, worker, gerente, admin';

COMMENT ON TABLE "addresses" IS 'Direcciones de entrega de los usuarios';

COMMENT ON TABLE "categories" IS 'Categorías de productos (Tortas, Cupcakes, etc.)';

COMMENT ON TABLE "products" IS 'Catálogo de productos (pasteles, postres, etc.)';

COMMENT ON TABLE "ingredients" IS 'Inventario de insumos y ingredientes';

COMMENT ON COLUMN "ingredients"."unit_of_measure" IS 'kg, gramos, litros, unidades';

COMMENT ON TABLE "product_ingredients" IS 'Recetas: qué ingredientes lleva cada producto';

COMMENT ON TABLE "orders" IS 'Pedidos realizados por los clientes';

COMMENT ON COLUMN "orders"."order_number" IS 'PASTRY-2024-0001';

COMMENT ON COLUMN "orders"."status" IS 'pendiente, confirmado, en_preparacion, listo, en_reparto, entregado, cancelado';

COMMENT ON COLUMN "orders"."delivery_type" IS 'recogida, domicilio';

COMMENT ON COLUMN "orders"."delivery_time_slot" IS '09:00-11:00, 14:00-16:00';

COMMENT ON COLUMN "orders"."payment_status" IS 'pendiente, pagado, fallido, reembolsado';

COMMENT ON TABLE "order_items" IS 'Items individuales de cada pedido';

COMMENT ON COLUMN "order_items"."customization_details" IS 'JSON: mensaje, color, etc.';

COMMENT ON TABLE "order_tracking" IS 'Seguimiento en tiempo real de pedidos (RF: SP01)';

COMMENT ON COLUMN "order_tracking"."latitude" IS 'Solo durante reparto';

COMMENT ON COLUMN "order_tracking"."longitude" IS 'Solo durante reparto';

COMMENT ON TABLE "inventory_movements" IS 'Historial de movimientos de inventario';

COMMENT ON COLUMN "inventory_movements"."movement_type" IS 'entrada, salida, ajuste, merma';

COMMENT ON COLUMN "inventory_movements"."reference_id" IS 'ID del pedido o compra relacionada';

COMMENT ON COLUMN "inventory_movements"."reference_type" IS 'pedido, compra, ajuste_manual';

COMMENT ON TABLE "stock_alerts" IS 'Alertas de stock crítico (RF: GI01)';

COMMENT ON COLUMN "stock_alerts"."alert_type" IS 'stock_critico, proximidad_vencimiento, agotado';

COMMENT ON TABLE "menus" IS 'Menús activos por período de tiempo';

COMMENT ON COLUMN "menus"."name" IS 'Menu Diciembre 2024, Menu Navideño';

COMMENT ON TABLE "menu_products" IS 'Productos disponibles en cada menú';

COMMENT ON COLUMN "menu_products"."special_price" IS 'Precio especial para este menú, null = precio base';

COMMENT ON COLUMN "menu_products"."max_daily_quantity" IS 'Límite diario de este producto, null = sin límite';

ALTER TABLE "addresses" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "products" ADD FOREIGN KEY ("category_id") REFERENCES "categories" ("id");

ALTER TABLE "product_ingredients" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "product_ingredients" ADD FOREIGN KEY ("ingredient_id") REFERENCES "ingredients" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("customer_id") REFERENCES "users" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("delivery_address_id") REFERENCES "addresses" ("id");

ALTER TABLE "order_items" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("id");

ALTER TABLE "order_items" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "order_tracking" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("id");

ALTER TABLE "order_tracking" ADD FOREIGN KEY ("worker_id") REFERENCES "users" ("id");

ALTER TABLE "inventory_movements" ADD FOREIGN KEY ("ingredient_id") REFERENCES "ingredients" ("id");

ALTER TABLE "inventory_movements" ADD FOREIGN KEY ("performed_by") REFERENCES "users" ("id");

ALTER TABLE "stock_alerts" ADD FOREIGN KEY ("ingredient_id") REFERENCES "ingredients" ("id");

ALTER TABLE "stock_alerts" ADD FOREIGN KEY ("resolved_by") REFERENCES "users" ("id");

ALTER TABLE "menus" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");

ALTER TABLE "menu_products" ADD FOREIGN KEY ("menu_id") REFERENCES "menus" ("id");

ALTER TABLE "menu_products" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "inventory_movements" ADD FOREIGN KEY ("description") REFERENCES "inventory_movements" ("movement_type");
