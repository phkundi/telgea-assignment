import { useState } from "react";
import TopBar from "./components/TopBar";
import PartnerApp from "./components/PartnerApp";
import PlanPage from "./components/PlanPage";
import Console from "./components/Console";
import type { Scenario } from "./types";
import { BRANDS } from "./types";
import { useJourney } from "./machine/useJourney";
import { createBuyActions } from "./machine/buyFlow";
import { createManageActions } from "./machine/manageFlow";

export default function App() {
  const [brandId, setBrandId] = useState(BRANDS[0].id);
  const [gating, setGating] = useState(false);
  const [scenario, setScenario] = useState<Scenario>("happy");

  // The state machine owns the journey state + console logs.
  const journey = useJourney();
  const { state, reset } = journey;

  const brand = BRANDS.find((b) => b.id === brandId) ?? BRANDS[0];

  // Journey handlers built over the state-machine primitives.
  const actions = createBuyActions(journey, brand, gating, scenario);
  const manageActions = createManageActions(journey, brand);

  const handleBuy = () => actions.start();
  const handleManage = () => manageActions.openManage();

  return (
    <div className="flex h-screen flex-col bg-slate-200">
      <TopBar
        brand={brand}
        onBrandChange={setBrandId}
        gating={gating}
        onGatingChange={setGating}
        scenario={scenario}
        onScenarioChange={setScenario}
        onReset={reset}
      />

      <main className="grid min-h-0 flex-1 grid-cols-[360px_1fr_1fr] gap-4 p-4">
        <section className="min-h-0 overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/10">
          <PartnerApp brand={brand} onBuy={handleBuy} onManage={handleManage} />
        </section>
        <section className="min-h-0 overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/10">
          <PlanPage
            brand={brand}
            state={state}
            actions={actions}
            manageActions={manageActions}
          />
        </section>
        <section className="min-h-0 overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/10">
          <Console logs={state.logs} />
        </section>
      </main>
    </div>
  );
}
