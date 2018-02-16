Pkg.add("Plots")
Pkg.add("GR")
using Plots
gr()
nbTest = 3
nbHit = [25 50 15]
nbMiss = [40 20 65]
nbTot = nbHit + nbMiss
y = [fill(2*n, nbTot[n]) for n in 1:nbTest]
q=histogram(y,nbins=5)
x = [fill(2*n, nbHit[n]) for n in 1:nbTest]
histogram!(q,x,nbins=5)
savefig(q,"myplot.pdf")
