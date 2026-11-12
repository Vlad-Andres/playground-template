# Binary search

Binary search finds the position of a target value in a sorted array. It compares the target with the middle element of the array. If they are equal, the search is over and the index of the middle element is returned. If the target is smaller, the search continues in the lower half; if it is larger, the search continues in the upper half. Each comparison removes half of the remaining elements, which is why the method is so fast on large inputs.

The algorithm keeps two indices, low and high, that mark the part of the array which can still contain the target. At the start, low is the first index and high is the last one. In every step we compute mid as the integer average of low and high. The loop stops when low becomes greater than high: at that point the target is not in the array, and the function returns a special value such as minus one.

A common mistake is to compute mid as (low + high) / 2 in languages with fixed-size integers. When both indices are large, the sum can overflow. The safe form is low + (high - low) / 2, which gives the same result without the risk. Another frequent error is an off-by-one bug in the update of low or high, which can lead to an endless loop.
---page---
# Cost of binary search

The running time of binary search is logarithmic in the length of the array. After the first comparison at most n / 2 elements remain, after the second at most n / 4, and after k comparisons at most n / 2^k. The search ends when this number drops below one, so the number of comparisons is about log2(n) in the worst case. For an array with one million elements this is only twenty comparisons.

This makes binary search much faster than linear search, which may have to look at every element. The price is that the array has to be sorted first. Sorting costs n log n time, so binary search pays off when the same array is searched many times. For a single search on unsorted data, a simple linear scan is often the better choice.

The memory use is constant for the iterative version, because it needs only a few index variables. A recursive version is also common and is easy to read, but it uses a stack frame for each call. In practice the iterative form is preferred, especially in languages that do not optimise tail calls.
---page---
# Variants and applications

Binary search is not limited to finding one exact value. A lower-bound search returns the first position at which the target could be inserted while keeping the array sorted. An upper-bound search returns the position after the last element that is equal to the target. With both bounds we can count how many times a value occurs in a sorted array in logarithmic time.

The same idea works on any monotonic function. If we can test whether a candidate answer is too small or too large, we can search over the space of answers. This technique is called binary search on the answer and appears in many problems, for example finding the smallest capacity that is enough to ship all packages within a given number of days.

Databases and file systems use related ideas. B-trees store keys in sorted order inside large nodes, and a lookup follows the right child at each level, which is a generalisation of binary search to many branches. Understanding the simple version on arrays is therefore a good foundation for these more advanced structures.
