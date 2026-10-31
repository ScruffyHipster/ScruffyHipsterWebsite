import catalogue from "../../content/smarty-colours/catalogue.json";
import { makeSmartyColourRoutes } from "./smartyColourRouteData.js";
import { getSiteUrl } from "../seo/metadata";
export const smartyColourRoutes = makeSmartyColourRoutes(catalogue, getSiteUrl());
export const smartyColourSeo = (path: string) => smartyColourRoutes.find(route => route.path === path.replace(/\/$/, ""))!;
