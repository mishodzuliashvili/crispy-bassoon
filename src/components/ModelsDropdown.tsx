import { RentOptions } from "../models/Documents";
import { AugmentedMansModelsType, MansType, ModelsType } from "../models/Types";
import { useEffect, useState } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { RiCheckboxBlankLine, RiCheckboxFill } from "react-icons/ri";
import { useRef } from "react";
export const ModelsDropdown = ({
  modelsOptions,
  chosenModels,
  setChosenModels,
  mansOptions,
  setChosenMans,
}: {
  modelsOptions: AugmentedMansModelsType[];
  chosenModels: AugmentedMansModelsType[];
  setChosenModels: React.Dispatch<
    React.SetStateAction<AugmentedMansModelsType[]>
  >;
  setChosenMans: React.Dispatch<React.SetStateAction<MansType[]>>;

  mansOptions: MansType[];
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<any>(null);

  useEffect(() => {
    const close = (e: Event) => {
      e.stopPropagation();
      if (
        (ref.current && ref.current.contains(e.target as Node)) ||
        (buttonRef.current && buttonRef.current?.contains(e.target as Node))
      )
        return;
      setOpen(false);
    };
    window.addEventListener("click", close);
    return () => {
      window.removeEventListener("click", close);
    };
  }, []);
  const isModelChosen = (model: ModelsType) => {
    return (
      chosenModels.findIndex(
        (c) =>
          c.models.findIndex((m) => {
            if ("sub_models" in m) {
              return (
                m.sub_models.findIndex(
                  (sm) => sm.model_id === model.model_id
                ) !== -1
              );
            } else {
              return m.model_id === model.model_id;
            }
          }) !== -1
      ) !== -1
    );
  };
  const isGroupChosen = (model_group: ModelsType["model_group"]) => {
    return (
      chosenModels.findIndex(
        (c) =>
          c.models.findIndex((m) => {
            if ("sub_models" in m) {
              return m.model_group === model_group;
            }
            return false;
          }) !== -1
      ) !== -1
    );
  };
  return (
    <div className="relative overflow-visible">
      <div className="mb-2">მოდელი</div>
      <button
        ref={buttonRef}
        onClick={(e) => {
          setOpen(!open);
        }}
        className="flex bg-white rounded-lg p-3 items-center gap-1 w-full justify-between border border-gray-300 hover:border-gray-400 "
      >
        {chosenModels.length > 0 ? (
          <span className="w-3/4 truncate text-left">
            {chosenModels
              .map((c) =>
                c.models
                  .map((cc) =>
                    "sub_models" in cc
                      ? cc.sub_models.map((ccc) => ccc.model_name).join(", ")
                      : cc.model_name
                  )
                  .join(", ")
              )
              .join(", ")}
          </span>
        ) : (
          <span className="text-gray-500">მოდელი</span>
        )}
        <MdOutlineKeyboardArrowDown
          className={(open ? "rotate-180" : "") + " duration-300 text-gray-500"}
        />
      </button>

      {open && (
        <div
          ref={ref}
          className="absolute w-full bg-white rounded-lg border border-gray-300 left-0 top-24 z-50"
        >
          <div className="flex flex-col p-4 max-h-80 overflow-auto">
            {modelsOptions.map((o) => (
              <div key={o.man_id}>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setChosenMans((chosenMans) =>
                      chosenMans.filter((c) => c.man_id !== o.man_id)
                    );
                  }}
                  className="flex gap-2 border-b border-b-gray-300 cursor-pointer"
                >
                  <RiCheckboxFill className="text-xl text-orange-600" />
                  <span>
                    {mansOptions.find((m) => m.man_id === o.man_id)?.man_name}
                  </span>
                </div>
                <div>
                  {o.models.map((c) => {
                    if ("sub_models" in c) {
                      return (
                        <div
                          key={c.model_group}
                          className="flex pl-6 items-center gap-2 cursor-pointer text-gray-500 hover:text-black duration-300 py-1"
                          // onClick={(e) => {
                          //   e.stopPropagation();
                          // }}
                        >
                          {isGroupChosen(c.model_group) ? (
                            <RiCheckboxFill className="text-xl" />
                          ) : (
                            <RiCheckboxBlankLine className="text-xl" />
                          )}
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isGroupChosen(c.model_group)) {
                                setChosenModels(
                                  chosenModels.map((m) => ({
                                    ...m,
                                    models: m.models.filter(
                                      (mm) => mm.model_group !== c.model_group
                                    ),
                                  }))
                                );
                              } else {
                                let m_id = c.sub_models[0].man_id.toString();
                                if (
                                  chosenModels.findIndex(
                                    (cc) => cc.man_id === m_id
                                  ) === -1
                                ) {
                                  setChosenModels([
                                    ...chosenModels,
                                    { man_id: m_id, models: [c] },
                                  ]);
                                } else {
                                  setChosenModels(
                                    chosenModels.map((m) =>
                                      m.man_id === m_id
                                        ? { ...m, models: [...m.models, c] }
                                        : m
                                    )
                                  );
                                }
                              }
                            }}
                          >
                            {c.model_group} a
                          </div>
                          <div>
                            {c.sub_models.map((s) => (
                              <div
                                key={s.model_id}
                                className="items-center gap-2 cursor-pointer text-gray-500 hover:text-black duration-300 py-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isModelChosen(s)) {
                                    setChosenModels(
                                      chosenModels
                                        .map((m) => ({
                                          ...m,
                                          models: m.models.map((mm) =>
                                            "sub_models" in mm
                                              ? {
                                                  ...mm,
                                                  sub_models:
                                                    mm.sub_models.filter(
                                                      (mmm) =>
                                                        mmm.model_id !==
                                                        s.model_id
                                                    ),
                                                }
                                              : mm
                                          ),
                                        }))
                                        .map((m) => ({
                                          ...m,
                                          models: m.models.filter((mm) =>
                                            "sub_models" in mm
                                              ? mm.sub_models.length > 0
                                              : true
                                          ),
                                        }))
                                    );
                                  } else {
                                    if (isGroupChosen(s.model_group)) {
                                      setChosenModels(
                                        chosenModels.map((m) => ({
                                          ...m,
                                          models: m.models.map((mm) =>
                                            "sub_models" in mm &&
                                            mm.model_group === s.model_group
                                              ? {
                                                  ...mm,
                                                  sub_models: [
                                                    ...mm.sub_models,
                                                    s,
                                                  ],
                                                }
                                              : mm
                                          ),
                                        }))
                                      );
                                    } else {
                                      // is man chosen
                                      if (
                                        chosenModels.findIndex(
                                          (cc) =>
                                            cc.man_id === s.man_id.toString()
                                        ) !== -1
                                      ) {
                                        setChosenModels(
                                          chosenModels.map((m) => ({
                                            ...m,
                                            models:
                                              m.man_id === s.man_id.toString()
                                                ? [
                                                    ...m.models,
                                                    {
                                                      model_group:
                                                        s.model_group,
                                                      sub_models: [s],
                                                    },
                                                  ]
                                                : m.models,
                                          }))
                                        );
                                      } else {
                                        console.log("e");
                                        setChosenModels([
                                          ...chosenModels,
                                          {
                                            man_id: s.man_id.toString(),
                                            models: [
                                              {
                                                model_group: s.model_group,
                                                sub_models: [s],
                                              },
                                            ],
                                          },
                                        ]);
                                      }
                                    }
                                  }
                                }}
                              >
                                {isModelChosen(s) ? (
                                  <RiCheckboxFill className="text-xl" />
                                ) : (
                                  <RiCheckboxBlankLine className="text-xl" />
                                )}
                                {s.model_name}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div
                        key={c.model_id}
                        className="flex items-center gap-2 cursor-pointer text-gray-500 hover:text-black duration-300 py-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isModelChosen(c)) {
                            console.log("e");
                            setChosenModels((chosenModels) =>
                              chosenModels.map((m) => ({
                                ...m,
                                models: m.models.filter(
                                  (mm) =>
                                    ("model_id" in mm &&
                                      mm.model_id !== c.model_id) ||
                                    "sub_models" in mm
                                ),
                              }))
                            );
                          } else {
                            if (
                              chosenModels.findIndex(
                                (aa) => aa.man_id === c.man_id.toString()
                              ) !== -1
                            ) {
                              setChosenModels(
                                chosenModels.map((m) =>
                                  m.man_id === c.man_id.toString()
                                    ? { ...m, models: [...m.models, c] }
                                    : m
                                )
                              );
                            } else {
                              setChosenModels([
                                ...chosenModels,
                                { man_id: c.man_id.toString(), models: [c] },
                              ]);
                            }
                          }
                        }}
                      >
                        {isModelChosen(c) ? (
                          <RiCheckboxFill className="text-xl" />
                        ) : (
                          <RiCheckboxBlankLine className="text-xl" />
                        )}

                        <span>{c.model_name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-r-gray-300 px-3 py-2 flex justify-between">
            <button
              className="p-1"
              onClick={(e) => {
                e.stopPropagation();
                setChosenModels([]);
              }}
            >
              გასუფთავება
            </button>
            <button
              className="p-1 px-2 bg-[rgb(253,65,0)] text-white rounded-lg"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
            >
              არჩევა
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
