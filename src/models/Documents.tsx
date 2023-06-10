import {
  AugmentedMansModelsType,
  AugmentedProductType,
  CatsType,
  MansType,
  ModelsType,
  PeriodType,
  ProductType,
  RentType,
  SearchResponseType,
  SearchType,
  SortType,
} from "./Types";

export const RentOptions: RentType[] = [
  { name: "იყიდება", id: 0, value: 0 },
  { name: "ქირავდება", id: 1, value: 1 },
];

export const SortOptions: SortType[] = [
  { name: "თარიღი კლებადი", value: 1, id: 0 },
  { name: "თარიღი ზრდადი", value: 2, id: 1 },
  { name: "ფასი კლებადი", value: 3, id: 2 },
  { name: "ფასი ზრდადი", value: 4, id: 3 },
  { name: "გარბენი კლებადი", value: 5, id: 4 },
  { name: "გარბენი ზრდადი", value: 6, id: 5 },
];

export const PeriodOptions: PeriodType[] = [
  { name: "1 საათი", id: 0, value: "1h" },
  { name: "2 საათი", id: 1, value: "2h" },
  { name: "3 საათი", id: 2, value: "3h" },
  { name: "1 დღე", id: 3, value: "1d" },
  { name: "2 დღე", id: 4, value: "2d" },
  { name: "3 დღე", id: 5, value: "3d" },
  { name: "1 კვირა", id: 6, value: "1w" },
  { name: "2 კვირა", id: 7, value: "2w" },
  { name: "3 კვირა", id: 8, value: "3w" },
];

export const getMansOptions = async (): Promise<MansType[]> => {
  const data = await fetch("https://static.my.ge/myauto/js/mans.json").then(
    (res) => res.json()
  );
  return data;
};
export const getCatsOptions = async (): Promise<CatsType[]> => {
  const data = await fetch("https://api2.myauto.ge/ka/cats/get").then((res) =>
    res.json()
  );
  return data.data;
};

export const getModelsOfMan = async (id: number): Promise<ModelsType[]> => {
  const data = await fetch(
    `https://api2.myauto.ge/ka/getManModels?man_id=` + id
  ).then((res) => res.json());
  return data.data;
};

export const getModelsOfMans = async (
  ...ids: number[]
): Promise<AugmentedMansModelsType[]> => {
  let models: AugmentedMansModelsType[] = [];

  for (let index = 0; index < ids.length; index++) {
    const id = ids[index];
    type ModelsAttrType = (
      | { model_group: ModelsType["model_group"]; sub_models: ModelsType[] }
      | ModelsType
    )[];
    let modelsOfMan: ModelsAttrType = [];
    let ar = await getModelsOfMan(id);
    ar.forEach((val: ModelsType) => {
      if (val.model_group === "") {
        modelsOfMan.push(val);
      } else {
        let index = modelsOfMan.findIndex(
          (v) => v.model_group === val.model_group
        );
        if (index === -1) {
          modelsOfMan.push({
            model_group: val.model_group,
            sub_models: [val],
          });
        } else {
          (
            modelsOfMan[index] as {
              model_group: ModelsType["model_group"];
              sub_models: ModelsType[];
            }
          ).sub_models.push(val);
        }
      }
    });
    models.push({
      man_id: id.toString(),
      models: modelsOfMan,
    });
  }
  return models;
};
export const getProducts = async ({
  ForRent,
  MansWithModels,
  Cats = [],
  PriceFrom,
  PriceTo,
  Period,
  SortOrder,
  Page,
}: SearchType): Promise<SearchResponseType> => {
  const query = `https://api2.myauto.ge/ka/products/?ForRent=${
    ForRent ? ForRent : ""
  }&Mans=${
    MansWithModels
      ? MansWithModels.map(
          (m) =>
            m.man_id +
            (m.models.length > 0 ? "." : "") +
            m.models
              .map((c) => {
                if (
                  (
                    c as {
                      model_group: ModelsType["model_group"];
                      sub_models: ModelsType[];
                    }
                  ).sub_models !== undefined
                )
                  return (
                    c as {
                      model_group: ModelsType["model_group"];
                      sub_models: ModelsType[];
                    }
                  ).sub_models
                    .map((s) => s.model_id)
                    .join(".");
                else return (c as ModelsType).model_id;
              })
              .join(".")
        ).join("-")
      : ""
  }&Cats=${Cats.join(".")}&PriceFrom=${PriceFrom ? PriceFrom : ""}&PriceTo=${
    PriceTo ? PriceTo : ""
  }&Period=${Period ? Period : ""}&SortOrder=${
    SortOrder ? SortOrder : ""
  }&Page=${Page ? Page : ""}`;
  const mans = await getMansOptions();
  const map = new Map(
    mans.map((obj) => {
      return [obj.man_id, obj.man_name];
    })
  );

  const data: SearchResponseType = await fetch(query)
    .then((res) => res.json())
    .then((res) => {
      return {
        ...res.data.meta,
        data: res.data.items.map((item: ProductType) => ({
          ...item,
          img: `https://static.my.ge/myauto/photos/${item.photo}/thumbs/${item.car_id}_1.jpg?v=${item.photo_ver}`,
          man_name: map.get(item.man_id.toString()),
          model_name: "",
        })),
      };
    });

  const models = await getModelsOfMans(
    ...Array.from(new Set(data.data.map((m: AugmentedProductType) => m.man_id)))
  );
  let map1 = new Map();
  models.forEach((m) => {
    m.models.forEach((mm) => {
      if ("sub_models" in mm) {
        mm.sub_models.forEach((s) => {
          map1.set(s.model_id, s.model_name);
        });
      } else {
        map1.set(mm.model_id, mm.model_name);
      }
    });
  });
  return {
    ...data,
    data: data.data.map((item: AugmentedProductType) => ({
      ...item,
      model_name: map1.get(item.model_id),
    })),
  } as SearchResponseType;
};
