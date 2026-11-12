# The derivative

The derivative of a function describes how fast the value of the function changes when its input changes. For a function $f$ and a point $a$, the derivative $f'(a)$ is the limit of the difference quotient $\frac{f(a+h)-f(a)}{h}$ as $h$ approaches zero. Geometrically, it is the slope of the tangent line to the graph of $f$ at the point $(a, f(a))$. If this limit exists, we say that the function is differentiable at $a$.

Not every function has a derivative at every point. The absolute value function $|x|$ is continuous at zero, but it has a sharp corner there, and the limit of the difference quotient from the left is not equal to the limit from the right. A function that is differentiable at a point is always continuous at that point, but the converse is not true, as this example shows.

The derivative is itself a function. We write $f'(x)$ or $\frac{df}{dx}$ for the function that gives the slope at each point where it exists. Applying the same process again gives the second derivative, which describes how the slope changes and is related to the curvature of the graph.
---page---
# Rules of differentiation

Computing every derivative from the definition would be slow, so we use a small set of rules. The derivative of a constant is zero. The power rule says that the derivative of $x^n$ is $n x^{n-1}$ for any real exponent $n$. The derivative is linear: the derivative of a sum is the sum of the derivatives, and a constant factor can be moved outside.

For products we use the product rule: $(fg)' = f'g + fg'$. For quotients there is the quotient rule, $(f/g)' = \frac{f'g - fg'}{g^2}$, which holds wherever $g$ is not zero. The chain rule handles compositions: if $h(x) = f(g(x))$, then $h'(x) = f'(g(x)) \cdot g'(x)$. This rule is used very often, because many functions are built by putting one function inside another.

With these rules and the derivatives of a few basic functions, such as $\sin$, $\cos$, $e^x$ and $\ln x$, we can differentiate almost every function that appears in practice. It is useful to practise them until they become automatic.
---page---
# Using derivatives

Derivatives help us find the maximum and minimum values of a function. At an interior maximum or minimum of a differentiable function, the tangent is horizontal, so the derivative is zero. These points are called critical points. To decide whether a critical point is a maximum, a minimum or neither, we can look at the sign of the derivative on both sides, or use the second derivative.

In physics, the derivative of the position of an object with respect to time is its velocity, and the derivative of the velocity is the acceleration. In economics, the derivative of the cost function is the marginal cost, which tells us how much one more unit of product will cost. The same mathematical idea appears in many different fields.

Derivatives are also used to approximate functions. Near a point $a$, the tangent line $f(a) + f'(a)(x-a)$ is close to the graph of $f$. This linear approximation is the first step towards Taylor series, which use higher derivatives to build better and better approximations.
