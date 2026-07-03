import type { Brand } from '../types'
import type { MachineState } from '../machine/types'
import type { BuyActions } from '../machine/buyFlow'
import type { ManageActions } from '../machine/manageFlow'
import EmailEntry from '../screens/EmailEntry'
import MembershipCheck from '../screens/MembershipCheck'
import Blocked from '../screens/Blocked'
import OtpEntry from '../screens/OtpEntry'
import CountrySelect from '../screens/CountrySelect'
import PlanSelect from '../screens/PlanSelect'
import Payment from '../screens/Payment'
import Provisioning from '../screens/Provisioning'
import InstallInstructions from '../screens/InstallInstructions'
import InstallPending from '../screens/InstallPending'
import SmsFallback from '../screens/SmsFallback'
import Active from '../screens/Active'
import ManageAuth from '../screens/ManageAuth'
import ManageHome from '../screens/ManageHome'
import Cancelled from '../screens/Cancelled'
import { BrandMark, TelgeaMark } from '../screens/ui'

interface PlanPageProps {
  brand: Brand
  state: MachineState
  actions: BuyActions
  manageActions: ManageActions
}

/**
 * Column B — the Telgea-hosted, partner-branded plan page (a browser window).
 * Routes to the screen for the current state.
 */
export default function PlanPage({
  brand,
  state,
  actions,
  manageActions,
}: PlanPageProps) {
  const { colors } = brand
  const { data } = state

  return (
    <div className="flex h-full flex-col bg-slate-50">
      {/* Browser chrome — signals a separate web window, and the Telgea host reveals who runs it */}
      <div className="flex items-center gap-3 bg-slate-100 px-3 py-2">
        <span className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-slate-300" />
          <span className="h-3 w-3 rounded-full bg-slate-300" />
          <span className="h-3 w-3 rounded-full bg-slate-300" />
        </span>
        <div className="flex flex-1 items-center gap-1.5 rounded-md bg-white px-3 py-1 text-xs text-slate-500 shadow-inner">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="11" width="16" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
          {brand.webHost}
        </div>
      </div>

      {/* Branded header band */}
      <div
        className="flex items-center gap-2 px-5 py-3"
        style={{ backgroundColor: colors.primary, color: colors.onPrimary }}
      >
        <BrandMark brand={brand} size={26} />
        <span className="text-sm font-semibold">{brand.planPrefix}</span>
      </div>

      <div className="flex-1 overflow-y-auto">{renderScreen()}</div>

      {/* Powered-by: this branded page is operated by Telgea */}
      <div className="flex items-center justify-center gap-1 border-t border-slate-200 bg-white py-2 text-xs text-slate-400">
        <span>powered by</span>
        <TelgeaMark size={13} textClass="text-slate-500" />
      </div>
    </div>
  )

  function renderScreen() {
    switch (state.stateId) {
      case 'IDLE':
        return <IdleIntro brand={brand} />
      case 'EMAIL_ENTRY':
        return <EmailEntry brand={brand} onSubmit={actions.submitEmail} />
      case 'MEMBERSHIP_CHECK':
        return <MembershipCheck brand={brand} />
      case 'BLOCKED':
        return <Blocked brand={brand} />
      case 'OTP_SENT':
        return (
          <OtpEntry
            brand={brand}
            email={data.email ?? ''}
            onVerify={actions.verifyOtp}
          />
        )
      case 'COUNTRY_SELECT':
        return <CountrySelect brand={brand} onSelect={actions.selectCountry} />
      case 'PLAN_SELECT':
        return (
          <PlanSelect
            brand={brand}
            countryCode={data.countryCode}
            onSelect={actions.selectPlan}
          />
        )
      case 'PAYMENT':
        return <Payment brand={brand} plan={data.plan ?? ''} onPay={actions.pay} />
      case 'PROVISIONING':
        return <Provisioning brand={brand} />
      case 'INSTALL_INSTRUCTIONS':
        return (
          <InstallInstructions brand={brand} onInstalled={actions.confirmInstall} />
        )
      case 'INSTALL_PENDING':
        return <InstallPending brand={brand} />
      case 'SMS_FALLBACK':
        return (
          <SmsFallback
            brand={brand}
            msisdn={data.msisdn ?? ''}
            onSimulate={actions.simulateSms}
          />
        )
      case 'ACTIVE':
        return (
          <Active brand={brand} msisdn={data.msisdn ?? ''} onManage={actions.goManage} />
        )
      case 'MANAGE_AUTH':
        return (
          <ManageAuth
            brand={brand}
            onSendCode={manageActions.sendCode}
            onReauth={manageActions.reauth}
          />
        )
      case 'MANAGE_HOME':
        return <ManageHome brand={brand} data={data} actions={manageActions} />
      case 'CANCELLED':
        return <Cancelled brand={brand} reason={data.cancelReason} />
      default:
        return null
    }
  }
}

function IdleIntro({ brand }: { brand: Brand }) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <BrandMark brand={brand} size={72} />
      <h2 className="mt-4 text-xl font-bold text-slate-800">{brand.name} Mobile</h2>
      <p className="mt-2 max-w-xs text-sm text-slate-500">
        A mobile plan for {brand.name} fans — carry your club with you every day.
      </p>
    </div>
  )
}
