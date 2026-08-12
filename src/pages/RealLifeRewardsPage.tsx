import RealLifeRewards from '../components/RealLifeRewards'

export default function RealLifeRewardsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black gradient-text">Real Life Rewards</h2>
        <p className="text-sm text-purple-600 font-medium mt-1">Redeem points for real experiences and treats</p>
      </div>
      <RealLifeRewards />
    </div>
  )
}
