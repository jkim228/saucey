import { AppHeader } from './components/AppHeader'
import { BottomMenuBar } from './components/BottomMenuBar'
import { DayCarousel } from './components/DayCarousel'
import { GroceriesView } from './components/GroceriesView'
import { NewRecipeButton } from './components/NewRecipeButton'
import { RecipesView } from './components/RecipesView'
import { SaveWarning } from './components/SaveWarning'
import { useActiveTab } from './hooks/useActiveTab'
import { useGroceries } from './hooks/useGroceries'
import { useRecipeEditor } from './hooks/useRecipeEditor'
import { useWeekPlan } from './hooks/useWeekPlan'

export function App() {
  const plan = useWeekPlan()
  const groceries = useGroceries()
  const recipeEditor = useRecipeEditor(plan)
  const [activeTab, setActiveTab] = useActiveTab()
  const isCalendar = activeTab === 'calendar'
  const isRecipes = activeTab === 'recipes'

  function handleTabSelect(tab) {
    if (tab === activeTab) return
    plan.closePanel()
    recipeEditor.close()
    setActiveTab(tab)
  }

  // Groceries has no big heading, because its card has its own "Groceries" header.
  const header = isRecipes
    ? {
        heading: 'Recipes',
        action: <NewRecipeButton onClick={recipeEditor.openNew} />,
      }
    : { heading: isCalendar ? plan.weekLabel : null }

  return (
    <main className="mx-auto min-h-screen w-full max-w-[456px] pb-20">
      <AppHeader {...header} />
      {(plan.hasSaveError || groceries.hasSaveError) && <SaveWarning />}
      <div hidden={!isCalendar}>
        <DayCarousel plan={plan} isVisible={isCalendar} />
      </div>
      {isRecipes && (
        <RecipesView
          recipes={plan.recipes}
          editor={recipeEditor}
          tagOptions={plan.tagOptions}
          onAddTag={plan.addTag}
        />
      )}
      {activeTab === 'list' && <GroceriesView groceries={groceries} plan={plan} />}
      <BottomMenuBar activeTab={activeTab} onSelect={handleTabSelect} />
    </main>
  )
}
