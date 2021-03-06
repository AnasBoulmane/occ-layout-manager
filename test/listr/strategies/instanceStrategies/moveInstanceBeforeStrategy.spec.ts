import { moveInstanceBeforeStrategy } from "@listr/strategies/widgetInstances/moveInstanceBeforeStrategy";

import { findInstance } from "@helpers/findInstance";

import layoutStructure from "../../../mock/layoutStructure.json";

describe("moveInstanceBeforeStrategy", () => {
  it("should be defined", async () => {
    expect(moveInstanceBeforeStrategy).toBeTruthy();
  });

  it("should insert mainInstance Before refInstance.", async () => {
    const refInstance = require("../../../mock/refInstance.json");
    const mainInstance = require("../../../mock/moveMainInstance.json");
    const { layout } = JSON.parse(JSON.stringify(layoutStructure));
    const { region, widget, widgetIndex } = findInstance({ layout, instanceId: refInstance.repositoryId });
    // some deep cloning
    const layoutClone = JSON.parse(JSON.stringify(layout));
    const regionClone = JSON.parse(JSON.stringify(region));
    const widgetClone = JSON.parse(JSON.stringify(widget));
    // exec
    moveInstanceBeforeStrategy({
      layout,
      region,
      widget,
      widgetIndex,
      refInstance,
      mainInstance,
    });
    // layout, region and widget have changed
    expect(layout).not.toEqual(layoutClone);
    expect(region).not.toEqual(regionClone);
    expect(widget).toEqual(widgetClone);
    // widget (refInstance) have replaced by mainInstance
    expect(layout.regions.length).toEqual(layoutClone.regions.length);
    expect(region.widgets.length).toEqual(regionClone.widgets.length + 1);
    expect(region.widgets[widgetIndex]).toEqual({
      displayName: mainInstance.displayName,
      repositoryId: mainInstance.repositoryId,
      descriptor: {
        repositoryId: mainInstance.descriptor.repositoryId,
        minWidth: mainInstance.descriptor.minWidth,
        editableWidget: mainInstance.descriptor.editableWidget,
        ...(mainInstance.descriptor.source && { source: mainInstance.descriptor.source }),
      },
    });
  });
});
