import { databaseOptions } from "@/database/database-options";
import { DataSource, DataSourceOptions } from "typeorm";

export default new DataSource(databaseOptions as DataSourceOptions);
