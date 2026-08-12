import RewardsShop from '../components/RewardsShop'

export default function ShopPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black gradient-text">Rewards Shop</h2>
        <p className="text-sm text-purple-600 font-medium mt-1">Spend points on themes, avatars, minigames, and power-ups</p>
      </div>
      <RewardsShop />
    </div>
  )
}
